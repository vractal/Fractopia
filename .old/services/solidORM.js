// Objetivo é facilitar o desenvolvimento com o solid,
// Como?

// Operações basicas tem que ser simples
// CRUD
// Modelo de dados das coisas e relações (Schema) (compartilhaveis)
// Formas de indexar manuais ou automáticas (conjunto de arquivos cache do sistema)
//       - Links feitos manualmente na hora de salvar ou repassando periodicamente nos dados
//       - indexes podem ser separados
//
// funções basicas e exemplos de como poderia ser

// orm.container['notes'].values
// orm.thing['note'].update()

import {
  createSolidDataset,
  getSolidDataset,
  saveSolidDatasetAt,
} from "@inrupt/solid-client";

const getOrCreateContainer = async (containerUri, fetch) => {
  const indexUrl = `${containerUri}/index.ttl`;
  try {
    const container = await getSolidDataset(indexUrl, { fetch });
    return container;
  } catch (error) {
    if (error.statusCode === 404) {
      const container = await saveSolidDatasetAt(
        indexUrl,
        createSolidDataset(),
        {
          fetch,
        }
      );
      return container;
    }
  }
};

export { getOrCreateContainer };
