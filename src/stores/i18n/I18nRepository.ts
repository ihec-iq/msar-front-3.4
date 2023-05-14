import { ReactiveRepository } from "./ReactiveRepository";
import { readonly } from "vue";
import axios from "axios";

export interface I18nInformation {
  info: { lang: string };
  langTextRepo: Record<string, Record<string, string>>;
}

export class I18nInformationImpl implements I18nInformation {
  info: { lang: string };
  langTextRepo: Record<string, Record<string, string>>;

  public constructor(lang: string, textRepo: Record<string, string>) {
    this.info = { lang };
    this.langTextRepo = {};
    this.langTextRepo[lang] = textRepo;
  }
}

class I18nRepository extends ReactiveRepository<I18nInformation> {
  constructor() {
    super();
    // this.setLanguage("ar");
  }

  protected data(): I18nInformation {
    return new I18nInformationImpl("", {});
  }
  public getState(): I18nInformation {
    if (!this.state.info.lang) this.setLanguage("en");
    return readonly(this.state) as I18nInformation;
  }

  public setLanguage(lang: string): void {
    // console.log("set language to : " + lang);
    const lan = localStorage.getItem("lang");
    if (lan == "" || lan == null) return;
    if (!this.state.langTextRepo[lang]) {
      //const that = this;
      axios
        .get<Record<string, string>>(`/src/locales/${lan}.json`)
        .then((r) => {
          this.state.langTextRepo[lang] = r.data as Record<string, string>;
          this.state.info.lang = lang;
        })
        .catch(() => {
          this.state.langTextRepo[lang] = {};
          this.state.info.lang = lang;
        });
    } else {
      this.state.info.lang = lang;
    }
  }
  public changeLanguage(lang: string): void {
    console.log("change to local : " + lang);
    localStorage.setItem("lang", lang);
    console.log(localStorage.getItem("lang"));
    this.setLanguage(lang);
  }
}
export const i18nRepository = new I18nRepository();