import { ReactiveRepository } from "./ReactiveRepository";
import { readonly } from "vue";
import axios from "axios";

export interface I18nInformation {
  info: { lang: string | any };
  langTextRepo: Record<string, Record<string, string>>;
}

export class I18nInformationImpl implements I18nInformation {
  info: { lang: string };
  langTextRepo: Record<string, Record<string, string>>;

  public constructor(lang: string | any, textRepo: Record<string, string>) {
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
    const defLan = localStorage.getItem("lang")?.toString();
    // console.log("def lan ::: ".defLan);
    return new I18nInformationImpl("", {});
  }
  public getState(): I18nInformation {
    this.state.info.lang = localStorage.getItem("lang")?.toString();
    if (!this.state.info.lang || this.state.info.lang == undefined) {
      this.setLanguage("en");
      localStorage.setItem("lang", "en");
      // console.log("Defualt EN ");
    }
    // console.log(this.state.info.lang);
    return readonly(this.state) as I18nInformation;
  }
  public setLanguage(lang: string): void {
    console.log(this.setLanguage);

    if (!this.state.langTextRepo[lang]) {
      //const that = this;
      axios
        .get<Record<string, string>>(`/src/locales/${lang}.json`)
        .then((r) => {
          this.state.langTextRepo[lang] = r.data as Record<string, string>;
          this.state.info.lang = lang;
          localStorage.setItem("lang", lang);
        })
        .catch(() => {
          this.state.langTextRepo[lang] = {};
          this.state.info.lang = lang;
        });
    } else {
      this.state.info.lang = lang;
    }
  }
}

export const i18nRepository = new I18nRepository();
