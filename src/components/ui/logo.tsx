import Image from 'next/image';

type LogoProps = {
  className?: string;
};

const Logo = ({ className }: LogoProps) => {
  return <Image src="/images/logo.png" alt="Logo" height={50} width={50} className={className} />;
};

export default Logo;
