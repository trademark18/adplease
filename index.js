const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true })
 
nightmare
    .authentication('', '') // Put username and password here
    .goto('https://ezlmportaldc1f.adp.com/ezLaborManagerNetRedirect/MAPortalStart.aspx?ISIClientID=Archetype1')
    .click('#UI4_ctBody_UCTodaysActivities_btnTimeSheet')
    .click('#INTIMEtm_0')
    .type('#INTIMEtm_0', '08:30a')
    .type('#OUTTIMEtm_0', '08:45a')

    //.type('#password', '')
  // TODO: add a config file and maybe have it contain U/P
//   .type('#search_form_input_homepage', 'github nightmare')
//   .wait('#r1-0 a.result__a')
//   .evaluate(() => document.querySelector('#r1-0 a.result__a').href)
  .wait(80000)
  .end()
  .then(console.log)
  .catch(error => {
    console.error('Search failed:', error)
  })