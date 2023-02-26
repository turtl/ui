import * as loc from '../src/util/i18n';

export async function setup() {
    // set to fake, make sure we use t() labels instead of actual test.
    //
    // NOTE: this doesn't actually DO anything, even setting it to ['en-US']
    // doesn't actually load i18n, but i guess it's not a problem to have this
    // then either way...
    loc.init({lang: ['zz-ZZ']});
}

