import type { IconProps } from "../types";
import {
	Paperclip as LucidePaperclip,
	Send as LucideSend,
	Github,
} from "lucide-react";
import { forwardRef } from "react";

export const PaperclipIcon = forwardRef<SVGSVGElement, IconProps>(
	(props, ref) => <LucidePaperclip ref={ref} {...props} />,
);

export const SendIcon = forwardRef<SVGSVGElement, IconProps>((props, ref) => (
	<LucideSend ref={ref} {...props} />
));

export const GitHubIcon = (props: IconProps) => {
	return <Github {...props} />;
};

export * from "lucide-react";
