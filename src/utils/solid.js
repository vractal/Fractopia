
import { createThing, saveSolidDatasetAt, getSolidDataset, setThing, setStringNoLocale, addUrl } from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { rdfs, schema } from 'rdf-namespaces'

const addReferenceToFolderUrl = async (reference, url) => {
    let folderDataset = await getSolidDataset(url); // full url

    let folderItemThing = createThing({ name: reference.url.replace('#', '') }); // id or url?
    folderItemThing = setStringNoLocale(folderItemThing, rdfs.label, reference.name);
    folderItemThing = addUrl(folderItemThing, rdfs.subClassOf, reference.type);
    folderItemThing = setStringNoLocale(folderItemThing, schema.relatedLink, reference.url);

    folderDataset = setThing(folderDataset, folderItemThing);

    return saveSolidDatasetAt(url, folderDataset, {
        fetch: fetch,
    });
}
export { addReferenceToFolderUrl }
