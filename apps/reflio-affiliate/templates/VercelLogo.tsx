import Image from "next/image";
import logo from "../public/vercel-logo.png";

export function VercelLogo({ size = 180 }: { size?: number }) {
	return <div className="w-full flex justify-center p-4">
		<Image src={logo} width={size} alt="vercel logo" />
	</div>
}