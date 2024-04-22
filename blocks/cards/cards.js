import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const hasSplitQuadsClass = block.classList.contains('split-quads');

  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const link = row.querySelector('a');
    const href = link?.href;
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';

      if (div.classList.contains('cards-card-image')) {
        const aTag = document.createElement('a');
        aTag.href = href ? href : '#';
        aTag.append(...div.childNodes);
        div.append(aTag);
      }
    });
    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);


  /* Note: Need to improve code */
  if (hasSplitQuadsClass) {
    const singleGridDiv = document.createElement('div');
    singleGridDiv.classList.add('single-grid');
  
    const quadGridDiv = document.createElement('div');
    quadGridDiv.classList.add('quad-grid');
    const listItems = block.querySelectorAll('li');
  
    listItems.forEach(item => {
      const link = item.querySelector('a');
      const href = link?.href;
      const itemDiv = document.createElement('div');
      Array.from(item.childNodes).forEach(node => {
        itemDiv.appendChild(node.cloneNode(true));
      });
      itemDiv.classList.add('cards-card');
      
      const anchor = document.createElement('a');
      anchor.href = href;
      anchor.appendChild(itemDiv);
  
      const buttonContainer = anchor.querySelector('p.button-container');
      if (buttonContainer) {
        buttonContainer.parentNode.removeChild(buttonContainer);
      }
  
      if (item === listItems[0]) {
        singleGridDiv.appendChild(anchor);
      } else {
        quadGridDiv.appendChild(anchor);
      }
    });
  
    block.innerHTML = '';
    block.appendChild(singleGridDiv);
    block.appendChild(quadGridDiv);
  }
}
