// plugins/plausible.js
import { Plugin } from 'vue'
import Plausible from 'plausible-tracker';

export const PlausiblePlugin: Plugin = {
  install: (app, options) => {
    console.debug('PlausiblePlugin', {...options})
    const { enableAutoPageviews } = Plausible({...options});
    enableAutoPageviews();

    app.provide('$plausible', Plausible({...options}));
  },
};
