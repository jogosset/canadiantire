import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const link = row.querySelector('a');
    const href = link?.href;
    const li = document.createElement('li');
    const a = document.createElement('a');
    if (href) a.href = href;
    while (row.firstElementChild) a.append(row.firstElementChild);
    li.append(a);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'gallery-card-image';
      else div.className = 'gallery-card-body';
    });

    link.parentNode.remove(link);

    ul.append(li);
  });
  ul.querySelectorAll('img').forEach((img) => img.closest('picture').replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(ul);
}