import { backend } from 'declarations/backend';

document.addEventListener('DOMContentLoaded', async () => {
  const shoppingList = document.getElementById('shopping-list');
  const addItemForm = document.getElementById('add-item-form');
  const newItemInput = document.getElementById('new-item');

  // Function to render the shopping list
  async function renderShoppingList() {
    const items = await backend.getItems();
    shoppingList.innerHTML = '';
    items.forEach(item => {
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
      shoppingList.appendChild(li);
    });
  }

  // Add new item
  addItemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = newItemInput.value.trim();
    if (text) {
      await backend.addItem(text);
      newItemInput.value = '';
      renderShoppingList();
    }
  });

  // Initial render
  renderShoppingList();
});
