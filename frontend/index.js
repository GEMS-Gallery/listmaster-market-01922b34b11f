import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
  const shoppingList = document.getElementById('shopping-list');
  const addItemForm = document.getElementById('add-item-form');
  const newItemInput = document.getElementById('new-item');
  const itemTypeSelect = document.getElementById('item-type');

  // Function to render the shopping list
  async function renderShoppingList() {
    const items = await backend.getItems();
    shoppingList.innerHTML = '';

    // Group items by type
    const groupedItems = items.reduce((acc, item) => {
      if (!acc[item.itemType]) {
        acc[item.itemType] = [];
      }
      acc[item.itemType].push(item);
      return acc;
    }, {});

    // Render items by group
    for (const [type, typeItems] of Object.entries(groupedItems)) {
      const typeSection = document.createElement('div');
      typeSection.className = 'type-section';
      typeSection.innerHTML = `<h2>${type}</h2>`;

      const typeList = document.createElement('ul');
      typeItems.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span class="${item.completed ? 'completed' : ''}">${item.text}</span>
          <button class="toggle-btn"><i class="fas fa-check"></i></button>
          <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;
        li.querySelector('.toggle-btn').addEventListener('click', async () => {
          await backend.toggleCompleted(item.id);
          renderShoppingList();
        });
        li.querySelector('.delete-btn').addEventListener('click', async () => {
          await backend.deleteItem(item.id);
          renderShoppingList();
        });
        typeList.appendChild(li);
      });

      typeSection.appendChild(typeList);
      shoppingList.appendChild(typeSection);
    }
  }

  // Add new item
  addItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = newItemInput.value.trim();
    const itemType = itemTypeSelect.value;
    if (text && itemType) {
      await backend.addItem(text, itemType);
      newItemInput.value = '';
      itemTypeSelect.value = '';
      renderShoppingList();
    }
  });

  // Initial render
  renderShoppingList();
});
