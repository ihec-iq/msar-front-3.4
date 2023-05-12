import { i18nRepository } from "@/stores/i18n/I18nRepository";
export default function useLanguage() {
  const st = i18nRepository.getState();
  const t = (text: string) => {
    return st.langTextRepo[st.info.lang][text] || text;
  };
  const setLanguage = (text: string) => {
    i18nRepository.setLanguage(text);
  };
  const changeLanguage = (text: string) => {
    i18nRepository.changeLanguage(text);
  };
  return { t, setLanguage, changeLanguage };
}
