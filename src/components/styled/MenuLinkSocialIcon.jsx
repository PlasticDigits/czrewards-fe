import { useTheme } from '@mui/material';

export default function MenuLinkSocialIcon({
  href,
  src,
  alt,
  width,
  height,
  css,
}) {
  const theme = useTheme();
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      css={{
        paddingTop: 8,
        '&:hover': { borderBottom: 'solid 1px', paddingTop: 7 },
        ...css,
      }}
    >
      <img src={src} alt={alt} width={width} height={height} />
    </a>
  );
}
