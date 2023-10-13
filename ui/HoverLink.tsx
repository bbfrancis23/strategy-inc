import { Theme, Typography, useTheme } from "@mui/material";
import Link from "next/link";


export interface HoverLinkProps {
  href: string
  title: string
}

export const HoverLink = ({href, title}: HoverLinkProps) => {

  const theme: Theme = useTheme()

  return (
    <Typography sx={{pl: 1, '&:hover': {backgroundColor: 'action.hover'}}}>
      <Link href={href} style={{ color: theme.palette.text.primary}} >
        {title}
      </Link>
    </Typography>
  );
}
