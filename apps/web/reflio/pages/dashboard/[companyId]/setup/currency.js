import { useRouter } from 'next/router';
import { useState } from 'react';
import { editCurrency } from '@/utils/useUser';
import SetupProgress from '@/components/ui/SetupProgress'; 
import Button from '@/components/ui/Button'; 
import { useCompany } from '@/utils/CompanyContext';
import SEOMeta from '@/components/SEOMeta'; 
import LoadingDots from '@/components/ui/LoadingDots'; 

export default function StripeSetupPage() {
  const router = useRouter();
  const { activeCompany } = useCompany();
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    if(loading === true){
      return false;
    }

    const formData = new FormData(e.target);
    const data = {};
 
    for (let entry of formData.entries()) {
      data[entry[0]] = entry[1];
    }

    setLoading(true);

    await editCurrency(router?.query?.companyId, data).then((result) => {
      if(result === "success"){
        setErrorMessage(false);
        router.replace(`/dashboard/${router?.query?.companyId}/setup/campaign`);
      } else {
        setErrorMessage(true);
      }

      setLoading(false);
    });

  };

  return (
    <>
      <SEOMeta title="Currency Settings"/>
      <div className="py-12 border-b-4 border-gray-300">
        <div className="wrapper">
          <SetupProgress/>
        </div>
      </div>
      <div className="pt-12 mb-6">
        <div className="wrapper">
          <h1 className="text-2xl sm:text-3xl tracking-tight font-extrabold">Currency Settings</h1>
        </div>
      </div>
      <div className="wrapper">
        <div>
          {
            activeCompany ?
              <form className="rounded-xl bg-white max-w-2xl overflow-hidden shadow-lg border-4 border-gray-300" action="#" method="POST" onSubmit={handleSubmit}>
                <div className="p-6">
                  <div className="space-y-8 divide-y divide-gray-200">
                    <div>
                      <div>
                        <div>
                          <label htmlFor="company_currency" className="text-xl font-semibold text-gray-900 mb-3 block">
                            Display currency
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <select defaultValue={activeCompany?.company_currency ? activeCompany?.company_currency : 'USD'} className="rounded-xl border-2 border-gray-300 outline-none p-4" required="required" name="company_currency" id="company_currency">
                              <option value>-- Select a currency --</option>
                              <optgroup label="Popular currencies">
                                <option value="USD">USD - United States Dollar</option>
                                <option value="GBP">GBP - British Pound</option>
                                <option value="EUR">EUR - Euro</option>
                                <option value="CAD">CAD - Canadian Dollar</option>
                                <option value="AUD">AUD - Australian Dollar</option>
                                <option value="JPY">JPY - Japanese Yen</option>
                              </optgroup>
                              <optgroup label="All others">
                                <option value="AED">AED - United Arab Emirates Dirham</option>
                                <option value="AFN">AFN - Afghan Afghani</option>
                                <option value="ALL">ALL - Albanian Lek</option>
                                <option value="AMD">AMD - Armenian Dram</option>
                                <option value="ANG">ANG - Netherlands Antillean Gulden</option>
                                <option value="AOA">AOA - Angolan Kwanza</option>
                                <option value="ARS">ARS - Argentine Peso</option>
                                <option value="AWG">AWG - Aruban Florin</option>
                                <option value="AZN">AZN - Azerbaijani Manat</option>
                                <option value="BAM">BAM - Bosnia and Herzegovina Convertible Mark</option>
                                <option value="BBD">BBD - Barbadian Dollar</option>
                                <option value="BCH">BCH - Bitcoin Cash</option>
                                <option value="BDT">BDT - Bangladeshi Taka</option>
                                <option value="BGN">BGN - Bulgarian Lev</option>
                                <option value="BHD">BHD - Bahraini Dinar</option>
                                <option value="BIF">BIF - Burundian Franc</option>
                                <option value="BMD">BMD - Bermudian Dollar</option>
                                <option value="BND">BND - Brunei Dollar</option>
                                <option value="BOB">BOB - Bolivian Boliviano</option>
                                <option value="BRL">BRL - Brazilian Real</option>
                                <option value="BSD">BSD - Bahamian Dollar</option>
                                <option value="BTC">BTC - Bitcoin</option>
                                <option value="BTN">BTN - Bhutanese Ngultrum</option>
                                <option value="BWP">BWP - Botswana Pula</option>
                                <option value="BYN">BYN - Belarusian Ruble</option>
                                <option value="BYR">BYR - Belarusian Ruble</option>
                                <option value="BZD">BZD - Belize Dollar</option>
                                <option value="CDF">CDF - Congolese Franc</option>
                                <option value="CHF">CHF - Swiss Franc</option>
                                <option value="CLF">CLF - Unidad de Fomento</option>
                                <option value="CLP">CLP - Chilean Peso</option>
                                <option value="CNH">CNH - Chinese Renminbi Yuan Offshore</option>
                                <option value="CNY">CNY - Chinese Renminbi Yuan</option>
                                <option value="COP">COP - Colombian Peso</option>
                                <option value="CRC">CRC - Costa Rican Colón</option>
                                <option value="CUC">CUC - Cuban Convertible Peso</option>
                                <option value="CUP">CUP - Cuban Peso</option>
                                <option value="CVE">CVE - Cape Verdean Escudo</option>
                                <option value="CZK">CZK - Czech Koruna</option>
                                <option value="DJF">DJF - Djiboutian Franc</option>
                                <option value="DKK">DKK - Danish Krone</option>
                                <option value="DOP">DOP - Dominican Peso</option>
                                <option value="DZD">DZD - Algerian Dinar</option>
                                <option value="EEK">EEK - Estonian Kroon</option>
                                <option value="EGP">EGP - Egyptian Pound</option>
                                <option value="ERN">ERN - Eritrean Nakfa</option>
                                <option value="ETB">ETB - Ethiopian Birr</option>
                                <option value="FJD">FJD - Fijian Dollar</option>
                                <option value="FKP">FKP - Falkland Pound</option>
                                <option value="GBX">GBX - British Penny</option>
                                <option value="GEL">GEL - Georgian Lari</option>
                                <option value="GGP">GGP - Guernsey Pound</option>
                                <option value="GHS">GHS - Ghanaian Cedi</option>
                                <option value="GHS">GHS - Ghanaian Cedi</option>
                                <option value="GIP">GIP - Gibraltar Pound</option>
                                <option value="GMD">GMD - Gambian Dalasi</option>
                                <option value="GNF">GNF - Guinean Franc</option>
                                <option value="GTQ">GTQ - Guatemalan Quetzal</option>
                                <option value="GYD">GYD - Guyanese Dollar</option>
                                <option value="HKD">HKD - Hong Kong Dollar</option>
                                <option value="HNL">HNL - Honduran Lempira</option>
                                <option value="HRK">HRK - Croatian Kuna</option>
                                <option value="HTG">HTG - Haitian Gourde</option>
                                <option value="HUF">HUF - Hungarian Forint</option>
                                <option value="IDR">IDR - Indonesian Rupiah</option>
                                <option value="ILS">ILS - Israeli New Sheqel</option>
                                <option value="IMP">IMP - Isle of Man Pound</option>
                                <option value="INR">INR - Indian Rupee</option>
                                <option value="IQD">IQD - Iraqi Dinar</option>
                                <option value="IRR">IRR - Iranian Rial</option>
                                <option value="ISK">ISK - Icelandic Króna</option>
                                <option value="JEP">JEP - Jersey Pound</option>
                                <option value="JMD">JMD - Jamaican Dollar</option>
                                <option value="JOD">JOD - Jordanian Dinar</option>
                                <option value="JPY">JPY - Japanese Yen</option>
                                <option value="KES">KES - Kenyan Shilling</option>
                                <option value="KGS">KGS - Kyrgyzstani Som</option>
                                <option value="KHR">KHR - Cambodian Riel</option>
                                <option value="KMF">KMF - Comorian Franc</option>
                                <option value="KPW">KPW - North Korean Won</option>
                                <option value="KRW">KRW - South Korean Won</option>
                                <option value="KWD">KWD - Kuwaiti Dinar</option>
                                <option value="KYD">KYD - Cayman Islands Dollar</option>
                                <option value="KZT">KZT - Kazakhstani Tenge</option>
                                <option value="LAK">LAK - Lao Kip</option>
                                <option value="LBP">LBP - Lebanese Pound</option>
                                <option value="LKR">LKR - Sri Lankan Rupee</option>
                                <option value="LRD">LRD - Liberian Dollar</option>
                                <option value="LSL">LSL - Lesotho Loti</option>
                                <option value="LTL">LTL - Lithuanian Litas</option>
                                <option value="LVL">LVL - Latvian Lats</option>
                                <option value="LYD">LYD - Libyan Dinar</option>
                                <option value="MAD">MAD - Moroccan Dirham</option>
                                <option value="MDL">MDL - Moldovan Leu</option>
                                <option value="MGA">MGA - Malagasy Ariary</option>
                                <option value="MKD">MKD - Macedonian Denar</option>
                                <option value="MMK">MMK - Myanmar Kyat</option>
                                <option value="MNT">MNT - Mongolian Tögrög</option>
                                <option value="MOP">MOP - Macanese Pataca</option>
                                <option value="MRO">MRO - Mauritanian Ouguiya</option>
                                <option value="MRU">MRU - Mauritanian Ouguiya</option>
                                <option value="MTL">MTL - Maltese Lira</option>
                                <option value="MUR">MUR - Mauritian Rupee</option>
                                <option value="MVR">MVR - Maldivian Rufiyaa</option>
                                <option value="MWK">MWK - Malawian Kwacha</option>
                                <option value="MXN">MXN - Mexican Peso</option>
                                <option value="MYR">MYR - Malaysian Ringgit</option>
                                <option value="MZN">MZN - Mozambican Metical</option>
                                <option value="NAD">NAD - Namibian Dollar</option>
                                <option value="NGN">NGN - Nigerian Naira</option>
                                <option value="NIO">NIO - Nicaraguan Córdoba</option>
                                <option value="NOK">NOK - Norwegian Krone</option>
                                <option value="NPR">NPR - Nepalese Rupee</option>
                                <option value="NZD">NZD - New Zealand Dollar</option>
                                <option value="OMR">OMR - Omani Rial</option>
                                <option value="PAB">PAB - Panamanian Balboa</option>
                                <option value="PEN">PEN - Peruvian Sol</option>
                                <option value="PGK">PGK - Papua New Guinean Kina</option>
                                <option value="PHP">PHP - Philippine Peso</option>
                                <option value="PKR">PKR - Pakistani Rupee</option>
                                <option value="PLN">PLN - Polish Złoty</option>
                                <option value="PYG">PYG - Paraguayan Guaraní</option>
                                <option value="QAR">QAR - Qatari Riyal</option>
                                <option value="RON">RON - Romanian Leu</option>
                                <option value="RSD">RSD - Serbian Dinar</option>
                                <option value="RUB">RUB - Russian Ruble</option>
                                <option value="RWF">RWF - Rwandan Franc</option>
                                <option value="SAR">SAR - Saudi Riyal</option>
                                <option value="SBD">SBD - Solomon Islands Dollar</option>
                                <option value="SCR">SCR - Seychellois Rupee</option>
                                <option value="SDG">SDG - Sudanese Pound</option>
                                <option value="SEK">SEK - Swedish Krona</option>
                                <option value="SGD">SGD - Singapore Dollar</option>
                                <option value="SHP">SHP - Saint Helenian Pound</option>
                                <option value="SKK">SKK - Slovak Koruna</option>
                                <option value="SLL">SLL - Sierra Leonean Leone</option>
                                <option value="SOS">SOS - Somali Shilling</option>
                                <option value="SRD">SRD - Surinamese Dollar</option>
                                <option value="SSP">SSP - South Sudanese Pound</option>
                                <option value="STD">STD - São Tomé and Príncipe Dobra</option>
                                <option value="SVC">SVC - Salvadoran Colón</option>
                                <option value="SYP">SYP - Syrian Pound</option>
                                <option value="SZL">SZL - Swazi Lilangeni</option>
                                <option value="THB">THB - Thai Baht</option>
                                <option value="TJS">TJS - Tajikistani Somoni</option>
                                <option value="TMM">TMM - Turkmenistani Manat</option>
                                <option value="TMT">TMT - Turkmenistani Manat</option>
                                <option value="TND">TND - Tunisian Dinar</option>
                                <option value="TOP">TOP - Tongan Paʻanga</option>
                                <option value="TRY">TRY - Turkish Lira</option>
                                <option value="TTD">TTD - Trinidad and Tobago Dollar</option>
                                <option value="TWD">TWD - New Taiwan Dollar</option>
                                <option value="TZS">TZS - Tanzanian Shilling</option>
                                <option value="UAH">UAH - Ukrainian Hryvnia</option>
                                <option value="UGX">UGX - Ugandan Shilling</option>
                                <option value="UYU">UYU - Uruguayan Peso</option>
                                <option value="UZS">UZS - Uzbekistan Som</option>
                                <option value="VEF">VEF - Venezuelan Bolívar</option>
                                <option value="VES">VES - Venezuelan Bolívar Soberano</option>
                                <option value="VND">VND - Vietnamese Đồng</option>
                                <option value="VUV">VUV - Vanuatu Vatu</option>
                                <option value="WST">WST - Samoan Tala</option>
                                <option value="XAF">XAF - Central African Cfa Franc</option>
                                <option value="XAG">XAG - Silver (Troy Ounce)</option>
                                <option value="XAU">XAU - Gold (Troy Ounce)</option>
                                <option value="XBA">XBA - European Composite Unit</option>
                                <option value="XBB">XBB - European Monetary Unit</option>
                                <option value="XBC">XBC - European Unit of Account 9</option>
                                <option value="XBD">XBD - European Unit of Account 17</option>
                                <option value="XCD">XCD - East Caribbean Dollar</option>
                                <option value="XDR">XDR - Special Drawing Rights</option>
                                <option value="XFU">XFU - UIC Franc</option>
                                <option value="XOF">XOF - West African Cfa Franc</option>
                                <option value="XPD">XPD - Palladium</option>
                                <option value="XPF">XPF - Cfp Franc</option>
                                <option value="XPT">XPT - Platinum</option>
                                <option value="XTS">XTS - Codes specifically reserved for testing purposes</option>
                                <option value="YER">YER - Yemeni Rial</option>
                                <option value="ZAR">ZAR - South African Rand</option>
                                <option value="ZMK">ZMK - Zambian Kwacha</option>
                                <option value="ZMW">ZMW - Zambian Kwacha</option>
                                <option value="ZWD">ZWD - Zimbabwean Dollar</option>
                                <option value="ZWL">ZWL - Zimbabwean Dollar</option>
                                <option value="ZWN">ZWN - Zimbabwean Dollar</option>
                                <option value="ZWR">ZWR - Zimbabwean Dollar</option>
                              </optgroup>
                            </select>
                          </div>
                        </div>
                      </div>

                      {
                        errorMessage &&
                        <div className="bg-red text-center p-4 mt-8 rounded-lg">
                          <p className="text-white text-sm font-medium">There was an error when creating your company, please try again later.</p>
                        </div>
                      }
                    </div>
                  </div>
                </div>
                <div className="border-t-4 p-6 bg-white flex items-center justify-start">
                  <Button
                    large
                    primary
                    disabled={loading}
                  >
                    <span>{loading ? 'Saving...' : 'Next Step'}</span>
                  </Button>
                </div>
              </form>
            :
              <div className="py-4">
                <LoadingDots/>
              </div>
          }
        </div>
      </div>
    </>
  );
}