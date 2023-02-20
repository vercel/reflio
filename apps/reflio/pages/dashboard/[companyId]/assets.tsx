import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/utils/supabase-client';
import { useUser } from '@/utils/useUser';
import SEOMeta from '@/templates/SEOMeta'; 
import Button from '@/components/Button';
import LoadingTile from '@/components/LoadingTile';
import { useCompany } from '@/utils/CompanyContext';
import toast from 'react-hot-toast';
import { FileUploader } from "react-drag-drop-files";
import { CloudUploadIcon, TrashIcon, PencilAltIcon, DocumentTextIcon } from '@heroicons/react/outline';
import { urlImgChecker } from '@/utils/helpers';

export default function AssetsPage() {
  const router = useRouter();
  const { user, session } = useUser();
  const { activeCompany } = useCompany();
  const fileInput = useRef<HTMLInputElement>(null);
  const [assets, setAssets] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  let fileTypes = ['SVG', 'EPS', 'PNG', 'JPG', 'JPEG', 'DOC', 'DOCX', 'CSV', 'XLS', 'XLSX', 'PDF', 'ZIP'];

  const getData = async () => {
    try {      
      setLoading(true);

      const { data } = await supabase
        .from('assets')
        .select('*')
        .eq('company_id', activeCompany?.company_id)
        
      if(data){
        let updatedData = data;
        await Promise.all(updatedData?.map(async (file: any) => {
          const signedUrl = await supabase.storage.from(`/`).createSignedUrl(file?.file_name, 120);
          file.signed_url = signedUrl?.signedURL;
        }));
        setAssets(updatedData);
      }

    } catch (error) {
      console.log('Error:')
      console.log(error)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(loading === false && activeCompany?.company_id){
      getData();
    }
  }, [session, activeCompany]);

  const handleFileUpload = async (e: any, uploadTypes: string) => {
    const files = uploadTypes === 'button' ? e.target.files : e;

    if(files.length === 0) return false;
    
    if(files.length > 1){
      if (window.confirm(`Upload ${files.length} files`)){
        toast.success("Uploading files...");
      } else {
        toast.error("File upload cancelled");
        return false;
      }
    }

    const imagesArray = [...files];
    await Promise.all(imagesArray?.map(async (file: any) => {
      let fileId = file.name.replace(/\s+/g, '') + '-' + Date.now();
      console.log(fileId);
      const { data, error } = await supabase.storage
        .from(`affiliate-assets/${activeCompany?.company_id}`)
        .upload(`${fileId}`, file, {
          upsert: true
        });
    
      if (error){
        console.log('error: ', error);    
      }
    
      if(data?.Key){
        await supabase.from('assets').insert({
          id: user?.id,
          team_id: activeCompany?.team_id,
          company_id: activeCompany?.company_id,
          file_name: data?.Key,
          file_custom_name: fileId,
          file_size: file.size,
        });
      }
    }));

    router.reload();
  };

  const handleFileClick = () => {
    if(fileInput.current){
      fileInput.current.click()
    }
  };

  const handleAssetDelete = async (assetId: string, fileName: string) => {
    if (window.confirm('Are you sure you wish to delete this file?')){
      const { error } = await supabase
      .from('assets')
      .delete()
      .match({ asset_id: assetId })
      
      await supabase.storage
        .from(`affiliate-assets`)
        .remove([fileName.replace('affiliate-assets/', '')]);

      console.log(error)
  
      if (error) {
        toast.error("There was an error deleting the file. Please try again later.");
      } else {
        toast.success("File deleted successfully");
        router.reload();
      }
    }
  };

  const handleAssetRename = async (assetId: string, fileName: string) => {
    let newFileName = prompt("Please enter a new file name", fileName);
    if (newFileName == null || newFileName == "") {
      toast.error("File rename cancelled");
    } else {
      const { error } = await supabase
      .from('assets')
      .update({ file_custom_name: newFileName })
      .match({ asset_id: assetId })
  
      if (error) {
        toast.error("There was an error renaming the file. Please try again later.");
      } else {
        toast.success("File renamed successfully");
        router.reload();
      }
    }
  };

  return (
    <>
      <SEOMeta title="Assets"/>
      <div className="pb-10 mb-12 border-b-4">
        <div className="pt-10 wrapper sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Assets</h1>
            <p>Share assets with your affiliates, which they can directly access in their dashboard. E.g. logo, brand guidelines, campaign guides, etc.</p>
          </div>
          <div>
            <input
              onChange={(e: any)=>handleFileUpload(e, 'button')}
              type="file"
              accept="image/*, application/pdf, .svg, .zip, .eps, .doc, .docx, .csv, .xls, .xlsx"
              style={{display: 'none'}}
              multiple={true}
              ref={fileInput}
            />
            <Button
              className="min-w-[200px] mt-4 sm:mt-0"
              medium
              primary
              mobileFull
              onClick={() => handleFileClick()}
            >
              <span>Upload Assets</span>
            </Button>
          </div>
        </div>
      </div>
      <div className="wrapper">
        <div>
          <FileUploader 
            classes="customFileUploader" 
            handleChange={(e: any)=>{handleFileUpload(e, 'dropzone')}} 
            name="file" 
            types={fileTypes} 
            multiple={true}
          >
            <div className="cursor-pointer p-6 rounded-xl border-4 border-dashed border-gray-300 relative min-h-[120px] flex items-center justify-center">
              <div className="flex justify-center items-center">
                <CloudUploadIcon className="w-8 text-gray-500 h-auto mr-2"/>
                <p className="text-lg text-gray-500">Drag and drop assets here, or click to upload.</p>
              </div>
            </div>
          </FileUploader>
        </div>
        <div>
          {
            assets?.length > 0 ?
              <div className="mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {
                    assets.map((asset: any) => (
                      <div key={asset?.asset_id} className="border-4 border-gray-200 rounded-xl p-8 pb-20 relative">
                        <p className="text-sm mb-4">{asset?.file_custom_name}</p>
                        {
                          urlImgChecker(asset?.signed_url) === true ?
                            <a href={asset?.signed_url} target="_blank" rel="noreferrer">                        
                              <img 
                                src={asset?.signed_url} 
                                alt={asset?.file_custom_name}
                                className="w-full h-auto max-h-[200px] object-contain"
                              />
                            </a>
                          :
                            <div className="min-h-[200px] p-3 rounded-xl bg-gray-200 border-4 border-gray-300 flex items-center justify-center">
                              <DocumentTextIcon className="w-20 h-auto text-gray-400"/>
                            </div>
                        }
                        <div className="absolute bottom-4 right-4 w-full flex items-center justify-end space-x-3">
                          <button
                            onClick={e=>{handleAssetRename(asset?.asset_id, asset?.file_custom_name)}}
                          >
                            <PencilAltIcon className="w-auto h-6"/>
                          </button>
                          <button
                            onClick={e=>{handleAssetDelete(asset?.asset_id, asset?.file_name)}}
                          >
                            <TrashIcon className="w-auto h-6"/>
                          </button>
                        </div>
                      </div>
                    ))
                  }
                </div>
                <div className="mt-8">
                  <p className="text-sm text-gray-500">{assets?.length} {assets?.length === 1 ? 'asset' : 'assets'} uploaded</p>
                </div>  
              </div>
            : 
              loading === true ?
                <div>
                  <LoadingTile/>
                </div>
              :
                <div className="mt-8">
                  <p className="text-sm text-gray-500">No assets uploaded</p>
                </div>  
          }
        </div>
      </div>
    </>
  );
}