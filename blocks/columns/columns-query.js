/* eslint-disable */
import AdobeAemHeadlessClientJs from 'https://cdn.skypack.dev/pin/@adobe/aem-headless-client-js@v3.2.0-R5xKUKJyh8kNAfej66Zg/mode=imports,min/optimized/@adobe/aem-headless-client-js.js';
import { getConfigValue } from '../../scripts/configs.js';
import { createOptimizedPicture } from '../../scripts/aem.js';

async function initialize(promotionQuery) {
  try {
    const AEM_HOST = await getConfigValue('aem-host');
    const AEM_GRAPHQL_ENDPOINT = await getConfigValue('aem-graphql-endpoint');
    const AEM_HEADLESS_CLIENT = new AdobeAemHeadlessClientJs({ serviceURL: AEM_HOST });
    let dataObj = {};

    dataObj = await AEM_HEADLESS_CLIENT.runPersistedQuery(AEM_GRAPHQL_ENDPOINT + promotionQuery);
    const data = dataObj?.data?.promotionList?.items;
    return data;

  } catch (error) {
    console.error('Error fetching data:', error);
    return false;
  }
}

export async function initQueryColumns(block) {
  const innerDiv = block.querySelector('div > div:nth-child(2)');
  const promotionsText = innerDiv.textContent;
  let data = [];
  let updatedColumnItems = [];

  data = await initialize(promotionsText);
  
  // create html
  data.forEach((item) => {
    const imagePath = item.promotionImage?._path;
    const parts = imagePath.split('/');
    const fileName = parts[parts.length - 1];
    const path = `/images/${fileName}`;
    const optimizedDemoImage = createOptimizedPicture(path, item.promotionId, true, [{ width: '1174' }]);

    updatedColumnItems.push(`
      <div id=${item.promotionId}>
        <div>
          <p><strong>${item.promotionTitle}</strong></p>
          <p>${item.promotionDetail.plaintext}</p>
          <p class="button-container"><a href="${item.promotionCtaUrl}" title="${item.promotionCtaLabel}" class="button">${item.promotionCtaLabel}</a></p>
        </div>
        <div class="columns-img-col">
          ${optimizedDemoImage.outerHTML}
        </div>
      </div>
    `);
  });
  
  block.innerHTML = updatedColumnItems.join('');
  block.style.display = 'block';
}
