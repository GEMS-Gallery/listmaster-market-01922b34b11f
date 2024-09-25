import Bool "mo:base/Bool";
import Func "mo:base/Func";
import List "mo:base/List";

import Array "mo:base/Array";
import Text "mo:base/Text";
import Nat "mo:base/Nat";

actor {
  // Define the structure for a shopping list item
  type ShoppingItem = {
    id: Nat;
    text: Text;
    completed: Bool;
    itemType: Text;
  };

  // Stable variable to store the shopping list items
  stable var shoppingList : [ShoppingItem] = [];
  stable var nextId : Nat = 0;

  // Function to add a new item to the shopping list
  public func addItem(text: Text, itemType: Text) : async Nat {
    let newItem : ShoppingItem = {
      id = nextId;
      text = text;
      completed = false;
      itemType = itemType;
    };
    shoppingList := Array.append(shoppingList, [newItem]);
    nextId += 1;
    nextId - 1
  };

  // Function to get all items in the shopping list
  public query func getItems() : async [ShoppingItem] {
    shoppingList
  };

  // Function to toggle the completed status of an item
  public func toggleCompleted(id: Nat) : async Bool {
    shoppingList := Array.map(shoppingList, func (item: ShoppingItem) : ShoppingItem {
      if (item.id == id) {
        return {
          id = item.id;
          text = item.text;
          completed = not item.completed;
          itemType = item.itemType;
        };
      };
      item
    });
    true
  };

  // Function to delete an item from the shopping list
  public func deleteItem(id: Nat) : async Bool {
    let oldLen = shoppingList.size();
    shoppingList := Array.filter(shoppingList, func (item: ShoppingItem) : Bool {
      item.id != id
    });
    shoppingList.size() != oldLen
  };
}
