
const locale_countries = [
  // ['Abkhazian', 'ab'],
  // ['Afar', 'aa'],
  // ['Afrikaans', 'af'],
  // ['Akan', 'ak'],
  // ['Albanian', 'sq'],
  // ['Amharic', 'am'],
  // ['Arabic', 'ar'],
  // ['Aragonese', 'an'],
  // ['Argentina', 'es-ar'],
  // ['Armenian', 'hy'],
  // ['Assamese', 'as'],
  // ['Avaric', 'av'],
  // ['Avestan', 'ae'],
  // ['Aymara', 'ay'],
  // ['Azerbaijani', 'az'],
  // ['Bambara', 'bm'],
  // ['Bashkir', 'ba'],
  // ['Basque', 'eu'],
  // ['Belarusian', 'be'],
  // ['Bengali (Bangla)', 'bn'],
  // ['Bihari', 'bh'],
  // ['Bislama', 'bi'],
  // ['Bosnian', 'bs'],
  // ['Breton', 'br'],
  // ['Bulgarian', 'bg'],
  // ['Burmese', 'my'],
  // ['Catalan', 'ca'],
  // ['Chamorro', 'ch'],
  // ['Chechen', 'ce'],
  // ['Chichewa, Chewa, Nyanja', 'ny'],
  // ['Chinese', 'zh'],
  // ['Chinese (Simplified)', 'zh-Hans'],
  // ['Chinese (Traditional)', 'zh-Hant'],
  // ['Chuvash', 'cv'],
  // ['Cornish', 'kw'],
  // ['Corsican', 'co'],
  // ['Cree', 'cr'],
  // ['Croatian', 'hr'],
  // ['Czech', 'cs'],
  // ['Danish', 'da'],
  // ['Divehi, Dhivehi, Maldivian', 'dv'],
  // ['Dutch', 'nl'],
  // ['Dzongkha', 'dz'],
  ['English', 'en'],
  ['Esperanto', 'eo'],
  ['Estonian', 'et'],
  ['Ewe', 'ee'],
  ['Faroese', 'fo'],
  ['Fijian', 'fj'],
  ['Finnish', 'fi'],
  ['French', 'fr'],
  ['Fula, Fulah, Pulaar, Pular', 'ff'],
  ['Galician', 'gl'],
  ['Gaelic (Scottish)', 'gd'],
  ['Gaelic (Manx)', 'gv'],
  ['Georgian', 'ka'],
  ['German', 'de'],
  ['Greek', 'el'],
  ['Greenlandic', 'kl'],
  ['Guarani', 'gn'],
  ['Gujarati', 'gu'],
  ['Haitian Creole', 'ht'],
  ['Hausa', 'ha'],
  ['Hebrew', 'he'],
  ['Herero', 'hz'],
  ['Hindi', 'hi'],
  ['Hiri Motu', 'ho'],
  ['Hungarian', 'hu'],
  ['Icelandic', 'is'],
  ['Ido', 'io'],
  ['Igbo', 'ig'],
  ['Indonesian', 'id, in'],
  ['Interlingua', 'ia'],
  ['Interlingue', 'ie'],
  ['Inuktitut', 'iu'],
  ['Inupiak', 'ik'],
  ['Irish', 'ga'],
  ['Italian', 'it'],
  ['Japanese', 'ja'],
  ['Javanese', 'jv'],
  ['Kalaallisut, Greenlandic', 'kl'],
  ['Kannada', 'kn'],
  ['Kanuri', 'kr'],
  ['Kashmiri', 'ks'],
  ['Kazakh', 'kk'],
  ['Khmer', 'km'],
  ['Kikuyu', 'ki'],
  ['Kinyarwanda (Rwanda)', 'rw'],
  ['Kirundi', 'rn'],
  ['Kyrgyz', 'ky'],
  ['Komi', 'kv'],
  ['Kongo', 'kg'],
  ['Korean', 'ko'],
  ['Kurdish', 'ku'],
  ['Kwanyama', 'kj'],
  ['Lao', 'lo'],
  ['Latin', 'la'],
  ['Latvian (Lettish)', 'lv'],
  ['Limburgish ( Limburger)', 'li'],
  ['Lingala', 'ln'],
  ['Lithuanian', 'lt'],
  ['Luga-Katanga', 'lu'],
  ['Luganda, Ganda', 'lg'],
  ['Luxembourgish', 'lb'],
  ['Manx', 'gv'],
  ['Macedonian', 'mk'],
  ['Malagasy', 'mg'],
  ['Malay', 'ms'],
  ['Malayalam', 'ml'],
  ['Maltese', 'mt'],
  ['Maori', 'mi'],
  ['Marathi', 'mr'],
  ['Marshallese', 'mh'],
  ['Moldavian', 'mo'],
  ['Mongolian', 'mn'],
  ['Nauru', 'na'],
  ['Navajo', 'nv'],
  ['Ndonga', 'ng'],
  ['Northern Ndebele', 'nd'],
  ['Nepali', 'ne'],
  ['Norwegian', 'no'],
  ['Norwegian bokmål', 'nb'],
  ['Norwegian nynorsk', 'nn'],
  ['Nuosu', 'ii'],
  ['Occitan', 'oc'],
  ['Ojibwe', 'oj'],
  ['Old Church Slavonic, Old Bulgarian', 'cu'],
  ['Oriya', 'or'],
  ['Oromo (Afaan Oromo)', 'om'],
  ['Ossetian', 'os'],
  ['Pāli', 'pi'],
  ['Pashto, Pushto', 'ps'],
  ['Persian (Farsi)', 'fa'],
  ['Polish', 'pl'],
  ['Portuguese', 'pt'],
  ['Punjabi (Eastern)', 'pa'],
  ['Quechua', 'qu'],
  ['Romansh', 'rm'],
  ['Romanian', 'ro'],
  ['Russian', 'ru'],
  ['Sami', 'se'],
  ['Samoan', 'sm'],
  ['Sango', 'sg'],
  ['Sanskrit', 'sa'],
  ['Serbian', 'sr'],
  ['Serbo-Croatian', 'sh'],
  ['Sesotho', 'st'],
  ['Setswana', 'tn'],
  ['Shona', 'sn'],
  ['Sichuan Yi', 'ii'],
  ['Sindhi', 'sd'],
  ['Sinhalese', 'si'],
  ['Siswati', 'ss'],
  ['Slovak', 'sk'],
  ['Slovenian', 'sl'],
  ['Somali', 'so'],
  ['Southern Ndebele', 'nr'],
  ['Spanish', 'es'],
  ['Sundanese', 'su'],
  ['Swahili (Kiswahili)', 'sw'],
  ['Swati', 'ss'],
  ['Swedish', 'sv'],
  ['Tagalog', 'tl'],
  ['Tahitian', 'ty'],
  ['Tajik', 'tg'],
  ['Tamil', 'ta'],
  ['Tatar', 'tt'],
  ['Telugu', 'te'],
  ['Thai', 'th'],
  ['Tibetan', 'bo'],
  ['Tigrinya', 'ti'],
  ['Tonga', 'to'],
  ['Tsonga', 'ts'],
  ['Turkish', 'tr'],
  ['Turkmen', 'tk'],
  ['Twi', 'tw'],
  ['Uyghur', 'ug'],
  ['Ukrainian', 'uk'],
  ['Urdu', 'ur'],
  ['Uzbek', 'uz'],
  ['Venda', 've'],
  ['Vietnamese', 'vi'],
  ['Volapük', 'vo'],
  ['Wallon', 'wa'],
  ['Welsh', 'cy'],
  ['Wolof', 'wo'],
  ['Western Frisian', 'fy'],
  ['Xhosa', 'xh'],
  ['Yiddish', 'yi', 'ji'],
  ['Yoruba', 'yo'],
  ['Zhuang, Chuang', 'za'],
  ['Zulu', 'zu'],
]

const locales = [
  // 'af-ZA',
  // 'am-ET',
  // 'ar-AE',
  // 'ar-BH',
  // 'ar-DZ',
  // 'ar-EG',
  // 'ar-IQ',
  // 'ar-JO',
  // 'ar-KW',
  // 'ar-LB',
  // 'ar-LY',
  // 'ar-MA',
  // 'arn-CL',
  // 'ar-OM',
  // 'ar-QA',
  // 'ar-SA',
  // 'ar-SD',
  // 'ar-SY',
  // 'ar-TN',
  // 'ar-YE',
  // 'as-IN',
  // 'az-az',
  // 'az-Cyrl-AZ',
  // 'az-Latn-AZ',
  // 'ba-RU',
  // 'be-BY',
  // 'bg-BG',
  // 'bn-BD',
  // 'bn-IN',
  // 'bo-CN',
  // 'br-FR',
  // 'bs-Cyrl-BA',
  // 'bs-Latn-BA',
  // 'ca-ES',
  // 'co-FR',
  // 'cs-CZ',
  // 'cy-GB',
  // 'da-DK',
  // 'de-AT',
  // 'de-CH',
  'de-DE',
  // 'de-LI',
  // 'de-LU',
  // 'dsb-DE',
  // 'dv-MV',
  // 'el-CY',
  // 'el-GR',
  // 'en-029',
  // 'en-AU',
  // 'en-BZ',
  // 'en-CA',
  // 'en-cb',
  'en-GB',
  // 'en-IE',
  // 'en-IN',
  // 'en-JM',
  // 'en-MT',
  // 'en-MY',
  // 'en-NZ',
  // 'en-PH',
  // 'en-SG',
  // 'en-TT',
  'en-US',
  // 'en-ZA',
  // 'en-ZW',
  // 'es-AR',
  // 'es-BO',
  // 'es-CL',
  // 'es-CO',
  // 'es-CR',
  // 'es-DO',
  // 'es-EC',
  // 'es-ES',
  // 'es-GT',
  // 'es-HN',
  // 'es-MX',
  // 'es-NI',
  // 'es-PA',
  // 'es-PE',
  // 'es-PR',
  // 'es-PY',
  // 'es-SV',
  // 'es-US',
  // 'es-UY',
  // 'es-VE',
  // 'et-EE',
  // 'eu-ES',
  // 'fa-IR',
  // 'fi-FI',
  // 'fil-PH',
  // 'fo-FO',
  // 'fr-BE',
  // 'fr-CA',
  // 'fr-CH',
  // 'fr-FR',
  // 'fr-LU',
  // 'fr-MC',
  // 'fy-NL',
  // 'ga-IE',
  // 'gd-GB',
  // 'gd-ie',
  // 'gl-ES',
  // 'gsw-FR',
  // 'gu-IN',
  // 'ha-Latn-NG',
  // 'he-IL',
  // 'hi-IN',
  // 'hr-BA',
  // 'hr-HR',
  // 'hsb-DE',
  // 'hu-HU',
  // 'hy-AM',
  // 'id-ID',
  // 'ig-NG',
  // 'ii-CN',
  // 'in-ID',
  // 'is-IS',
  // 'it-CH',
  // 'it-IT',
  // 'iu-Cans-CA',
  // 'iu-Latn-CA',
  // 'iw-IL',
  // 'ja-JP',
  // 'ka-GE',
  // 'kk-KZ',
  // 'kl-GL',
  // 'km-KH',
  // 'kn-IN',
  // 'kok-IN',
  // 'ko-KR',
  // 'ky-KG',
  // 'lb-LU',
  // 'lo-LA',
  // 'lt-LT',
  // 'lv-LV',
  // 'mi-NZ',
  // 'mk-MK',
  // 'ml-IN',
  // 'mn-MN',
  // 'mn-Mong-CN',
  // 'moh-CA',
  // 'mr-IN',
  // 'ms-BN',
  // 'ms-MY',
  // 'mt-MT',
  // 'nb-NO',
  // 'ne-NP',
  // 'nl-BE',
  // 'nl-NL',
  // 'nn-NO',
  // 'no-no',
  // 'nso-ZA',
  // 'oc-FR',
  // 'or-IN',
  // 'pa-IN',
  // 'pl-PL',
  // 'prs-AF',
  // 'ps-AF',
  // 'pt-BR',
  // 'pt-PT',
  // 'qut-GT',
  // 'quz-BO',
  // 'quz-EC',
  // 'quz-PE',
  // 'rm-CH',
  // 'ro-mo',
  // 'ro-RO',
  // 'ru-mo',
  // 'ru-RU',
  // 'rw-RW',
  // 'sah-RU',
  // 'sa-IN',
  // 'se-FI',
  // 'se-NO',
  // 'se-SE',
  // 'si-LK',
  // 'sk-SK',
  // 'sl-SI',
  // 'sma-NO',
  // 'sma-SE',
  // 'smj-NO',
  // 'smj-SE',
  // 'smn-FI',
  // 'sms-FI',
  // 'sq-AL',
  // 'sr-BA',
  // 'sr-CS',
  // 'sr-Cyrl-BA',
  // 'sr-Cyrl-CS',
  // 'sr-Cyrl-ME',
  // 'sr-Cyrl-RS',
  // 'sr-Latn-BA',
  // 'sr-Latn-CS',
  // 'sr-Latn-ME',
  // 'sr-Latn-RS',
  // 'sr-ME',
  // 'sr-RS',
  // 'sr-sp',
  // 'sv-FI',
  // 'sv-SE',
  // 'sw-KE',
  // 'syr-SY',
  // 'ta-IN',
  // 'te-IN',
  // 'tg-Cyrl-TJ',
  // 'th-TH',
  // 'tk-TM',
  // 'tlh-QS',
  // 'tn-ZA',
  // 'tr-TR',
  // 'tt-RU',
  // 'tzm-Latn-DZ',
  // 'ug-CN',
  // 'uk-UA',
  // 'ur-PK',
  // 'uz-Cyrl-UZ',
  // 'uz-Latn-UZ',
  // 'uz-uz',
  // 'vi-VN',
  // 'wo-SN',
  // 'xh-ZA',
  // 'yo-NG',
  // 'zh-CN',
  // 'zh-HK',
  // 'zh-MO',
  // 'zh-SG',
  // 'zh-TW',
  // 'zu-ZA',
]

const initialState = {
  // list: chains
  initial: true,
  dateTimeFormat: 'YYYY.MM.DD hh:mm:sss',
  itemsPerPage: 10,
  defaultCurrency: 'USD', // 'GBP', // 'EUR',
  defaultDecimals: 3,
  locales,
  locale: 'en-US',
}

const profile = {
  namespaced: true,
  state: { ...initialState },
  mutations: {
    SET_PROFILE (state: any, profile: any) {
      // console.debug('SET_PROFILE', profile)
      state.dateTimeFormat = profile.dateTimeFormat || state.dateTimeFormat
      state.itemsPerPage = profile.itemsPerPage || state.itemsPerPage
      state.defaultCurrency = profile.defaultCurrency || state.defaultCurrency
      state.defaultDecimals = profile.defaultDecimals || state.defaultDecimals
      state.locale = profile.locale || state.locale
    }
  },
  actions: {
    async logout ({ commit }: any) {
      await commit('SET_PROFILE', { ...initialState })
    },
    async setProfile ({ commit }: any, { profile }: any) {
      // console.debug('setProfile', profile)
      // commit the profile as a mutation
      await commit("SET_PROFILE", profile)
    }
  }
}

export { profile } 
