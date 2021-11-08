
const HiperFolder = "https://vocab.fractopia.org/portal"; // graph folders
// # Portal vocabularies
const Portal = "https://vocab.fractopia.org/portal";
const subPortal = "https://vocab.fractopia.org/rel/portal"; // graph folders

// Main screen you get when portal is active
const PortalInterface = "https://vocab.fractopia.org/PortalInterface"

const portalInterface = "https://vocab.fractopia.org/rel/portalInterface"
const defaultSubPortal = "https://vocab.fractopia.org/rel/defaultSubPortal"

const defaultLink = "https://vocab.fractopia.org/rel/defaultLink"
const relations = { subPortal, portalInterface, defaultSubPortal, defaultLink };


const fractopia = { Portal, HiperFolder, PortalInterface, relations };
export default fractopia;
