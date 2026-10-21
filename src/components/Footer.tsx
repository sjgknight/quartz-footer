import { readFileSync } from "fs";
import { join } from "path";
import type {
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
} from "@quartz-community/types";
import { i18n } from "../i18n";
import style from "./styles/footer.scss";

function getQuartzVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync(join(process.cwd(), "package.json"), "utf-8"));
    return pkg.version ?? "";
  } catch {
    return "";
  }
}

export interface FooterOptions {
  links: Record<string, string>;
}

export default ((opts?: FooterOptions) => {
  const version = getQuartzVersion();

  const Footer: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear();
    const links = opts?.links ?? [];

	// sjgknight to determine the appropriate footer component based on the slug
	const slug = fileData.slug
	// Custom fields to retrieve and add on key slug page
	const acknowl = opts?.acknowledgement ?? []
	const fund = opts?.funding ?? []
	
	// in the below, to return the variables as raw text you can use {fund} instead of the spans, the spans allow html rendering  
    return (
      <footer class={`${displayClass ?? ""}`}>
        <p>
          {i18n(cfg?.locale ?? "en-US").components.footer.createdWith}{" "}
          <a href="https://quartz.jzhao.xyz/">Quartz{version ? ` v${version}` : ""}</a> &copy;{" "}
          {year}
        </p>
        <p>
		{slug.includes("DECRA") && (
		  <>
			<span dangerouslySetInnerHTML={{ __html: acknowl }}></span>
			<br />
			<span dangerouslySetInnerHTML={{ __html: fund }}></span>
		  </>
   			)}
		</p>     
        <ul>
          {Object.entries(links).map(([text, link]) => (
            <li>
              <a href={link}>{text}</a>
            </li>
          ))}
        </ul>
      </footer>
    );
  };

  Footer.css = style;
  return Footer;
}) satisfies QuartzComponentConstructor;
