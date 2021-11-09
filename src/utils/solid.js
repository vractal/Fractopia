
import { createThing, getThing, removeThing, saveSolidDatasetAt, getSolidDataset, setThing, setStringNoLocale, addUrl } from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
// import { fetch } from "@inrupt/solid-client-authn-browser";
import { rdfs, schema } from 'rdf-namespaces'

const addReferenceToFolderUrl = async (reference, url) => {
    let folderDataset = await getSolidDataset(url); // full url

    let folderItemThing = createThing({ name: reference.url.replace('#', '') }); // id or url?
    folderItemThing = setStringNoLocale(folderItemThing, rdfs.label, reference.name);
    folderItemThing = addUrl(folderItemThing, rdfs.subClassOf, reference.type);
    folderItemThing = setStringNoLocale(folderItemThing, schema.relatedLink, reference.url);

    folderDataset = setThing(folderDataset, folderItemThing);

    return saveSolidDatasetAt(url, folderDataset, {
        fetch: fetch
    });
}
const removeReferenceToFolderUrl = async (reference, url) => {

    let folderDataset = await getSolidDataset(url); // full url
    let folderItemThing = getThing(folderDataset, url.replace("#self", "#" + reference.url.replace('#', '')))
    console.log('removeref', reference, url, folderDataset)
    folderDataset = removeThing(folderDataset, folderItemThing);
    return saveSolidDatasetAt(url, folderDataset, {
        fetch: fetch
    });
}
export { addReferenceToFolderUrl, removeReferenceToFolderUrl }
// https://testestestes.solidweb.org/public/Fractopia/v0.07/4394e307-ef7c-4fcd-a535-d130a1212ce6/hiperfolders/5ca13bee-d44a-4447-b4bb-0b4e73d27c6d#https://testestestes.solidweb.org/public/Fractopia/v0.07/4394e307-ef7c-4fcd-a535-d130a1212ce6/notes/19fae94b-0b18-40ea-b94d-1ddd2b5613c7self