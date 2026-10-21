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
  links?: Record<string, string>;
  /** Raw HTML shown on pages whose slug starts with one of `extraOnPrefixes`. */
  acknowledgement?: string;
  /** Raw HTML shown on pages whose slug starts with one of `extraOnPrefixes`. */
  funding?: string;
  /** Slug prefixes (case-insensitive) that show acknowledgement + funding, e.g. ["DECRA"]. */
  extraOnPrefixes?: string[];
}

export default ((opts?: FooterOptions) => {
  const version = getQuartzVersion();

  // sjgknight: custom fields to add on key sections of the site
  const acknowledgement = opts?.acknowledgement ?? "";
  const funding = opts?.funding ?? "";
  const prefixes = (opts?.extraOnPrefixes ?? []).map((p) => p.toLowerCase());

  const Footer: QuartzComponent = ({ fileData, displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear();
    const links = opts?.links ?? [];

    // sjgknight to determine the appropriate footer component based on the slug
    const slug = (fileData?.slug ?? "").toLowerCase();
    // Custom fields to retrieve and add on key slug page
    const showExtra =
      (acknowledgement || funding) && prefixes.some((p) => slug === p || slug.startsWith(p + "/"));

    // in the below, to return the variables as raw text you can use {fund} instead of the spans, the spans allow html rendering
    return (
      <footer class={`${displayClass ?? ""}`}>
        <p>
          {i18n(cfg?.locale ?? "en-US").components.footer.createdWith}{" "}
          <a href="https://quartz.jzhao.xyz/">Quartz{version ? ` v${version}` : ""}</a> &copy;{" "}
          {year}
        </p>
        {showExtra && (
          <p>
            {/* dangerouslySetInnerHTML lets the option strings contain links; use {funding} for plain text */}
            <span dangerouslySetInnerHTML={{ __html: acknowledgement }}></span>
            <br />
            <span dangerouslySetInnerHTML={{ __html: funding }}></span>
          </p>
        )}
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
