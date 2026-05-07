// ===== SINGLY LINKED LIST DATA STRUCTURE: 8-LANGUAGE IMPLEMENTATIONS =====
// A Singly Linked List is a linear data structure where each node contains:
//   1. Data (value)
//   2. Pointer/Reference to the next node
// Operations: Insert (head/tail/position), Delete (head/tail/position), Search, Traverse

export const CODE_SNIPPETS = {
  javascript: `// ===== SINGLY LINKED LIST: JAVASCRIPT =====
// Each node has a value and reference to next node

class Node {
  // Node constructor: Create new node with value
  constructor(value) {
    this.value = value;   // Data stored in node
    this.next = null;     // Pointer to next node (initially null)
  }
}

class LinkedList {
  // Initialize: Create empty linked list with null head
  constructor() {
    this.head = null;     // Head pointer (first node)
    this.size = 0;        // Track number of nodes
  }

  // INSERT AT HEAD: Add node at beginning - O(1)
  insertAtHead(value) {
    const node = new Node(value);     // Create new node
    node.next = this.head;            // New node points to current head
    this.head = node;                 // Update head to new node
    this.size++;                      // Increment size
  }

  // INSERT AT TAIL: Add node at end - O(n)
  insertAtTail(value) {
    const node = new Node(value);     // Create new node
    if (this.head === null) {         // If list is empty
      this.head = node;               // New node becomes head
    } else {
      let current = this.head;        // Start from head
      while (current.next !== null) { // Traverse to end
        current = current.next;       // Move to next node
      }
      current.next = node;            // Append new node
    }
    this.size++;                      // Increment size
  }

  // INSERT AT POSITION: Add node at specific index - O(n)
  insertAtPosition(value, position) {
    if (position < 0 || position > this.size) return false; // Invalid position
    if (position === 0) {             // Insert at head
      this.insertAtHead(value);
      return true;
    }
    const node = new Node(value);     // Create new node
    let current = this.head;          // Start from head
    let previous;
    let count = 0;
    while (count < position) {        // Traverse to position
      previous = current;             // Track previous node
      current = current.next;         // Move forward
      count++;
    }
    node.next = current;              // Link new node to next
    previous.next = node;             // Link previous to new node
    this.size++;                      // Increment size
    return true;
  }

  // DELETE FROM HEAD: Remove first node - O(1)
  deleteFromHead() {
    if (this.head === null) return null; // Empty list
    const value = this.head.value;    // Get value to return
    this.head = this.head.next;       // Move head to next node
    this.size--;                      // Decrement size
    return value;
  }

  // SEARCH: Find value in list - O(n)
  search(value) {
    let current = this.head;          // Start from head
    let position = 0;
    while (current !== null) {        // Traverse list
      if (current.value === value) {  // Found matching value
        return position;              // Return position
      }
      current = current.next;         // Move to next
      position++;
    }
    return -1;                        // Not found
  }

  // TRAVERSE: Get all values as array - O(n)
  traverse() {
    const result = [];                // Store all values
    let current = this.head;          // Start from head
    while (current !== null) {        // Visit every node
      result.push(current.value);     // Collect value
      current = current.next;         // Move to next
    }
    return result;
  }

  // GET SIZE: Return number of nodes - O(1)
  getSize() {
    return this.size;
  }
}

// Usage:
const list = new LinkedList();
list.insertAtHead(10); list.insertAtTail(20); list.insertAtTail(30);
console.log(list.traverse()); // [10, 20, 30]
console.log(list.search(20)); // 1 (position)`,

  python: `# ===== SINGLY LINKED LIST: PYTHON =====
# Each node contains value and reference to next node

class Node:
    # Node constructor: Create new node with value
    def __init__(self, value):
        self.value = value      # Data stored in node
        self.next = None        # Pointer to next node (initially None)

class LinkedList:
    # Initialize: Create empty linked list with None head
    def __init__(self):
        self.head = None        # Head pointer (first node)
        self.size = 0           # Track number of nodes
    
    # INSERT AT HEAD: Add node at beginning - O(1)
    def insertAtHead(self, value):
        node = Node(value)      # Create new node
        node.next = self.head   # New node points to current head
        self.head = node        # Update head to new node
        self.size += 1          # Increment size
    
    # INSERT AT TAIL: Add node at end - O(n)
    def insertAtTail(self, value):
        node = Node(value)      # Create new node
        if self.head is None:   # If list is empty
            self.head = node    # New node becomes head
        else:
            current = self.head # Start from head
            while current.next is not None: # Traverse to end
                current = current.next      # Move to next node
            current.next = node # Append new node
        self.size += 1          # Increment size
    
    # INSERT AT POSITION: Add node at specific index - O(n)
    def insertAtPosition(self, value, position):
        if position < 0 or position > self.size: # Invalid position
            return False
        if position == 0:       # Insert at head
            self.insertAtHead(value)
            return True
        node = Node(value)      # Create new node
        current = self.head     # Start from head
        previous = None
        count = 0
        while count < position: # Traverse to position
            previous = current  # Track previous node
            current = current.next # Move forward
            count += 1
        node.next = current     # Link new node to next
        previous.next = node    # Link previous to new node
        self.size += 1          # Increment size
        return True
    
    # DELETE FROM HEAD: Remove first node - O(1)
    def deleteFromHead(self):
        if self.head is None:   # Empty list
            return None
        value = self.head.value # Get value to return
        self.head = self.head.next # Move head to next
        self.size -= 1          # Decrement size
        return value
    
    # SEARCH: Find value in list - O(n)
    def search(self, value):
        current = self.head     # Start from head
        position = 0
        while current is not None: # Traverse list
            if current.value == value: # Found
                return position # Return position
            current = current.next # Move to next
            position += 1
        return -1               # Not found
    
    # TRAVERSE: Get all values as list - O(n)
    def traverse(self):
        result = []             # Store all values
        current = self.head     # Start from head
        while current is not None: # Visit every node
            result.append(current.value) # Collect value
            current = current.next # Move to next
        return result
    
    # GET SIZE: Return number of nodes - O(1)
    def getSize(self):
        return self.size

# Usage:
list = LinkedList()
list.insertAtHead(10); list.insertAtTail(20); list.insertAtTail(30)
print(list.traverse())  # [10, 20, 30]
print(list.search(20))  # 1 (position)`,

  java: `// ===== SINGLY LINKED LIST: JAVA =====
// Each node contains value and reference to next node

class Node {
    // Node constructor: Create new node with value
    int value;              // Data stored in node
    Node next;              // Pointer to next node
    
    public Node(int value) {
        this.value = value; // Initialize value
        this.next = null;   // Initialize pointer to null
    }
}

class LinkedList {
    private Node head;      // Head pointer (first node)
    private int size;       // Track number of nodes
    
    // Initialize: Create empty linked list
    public LinkedList() {
        this.head = null;   // Start with null head
        this.size = 0;      // Start with 0 nodes
    }
    
    // INSERT AT HEAD: Add node at beginning - O(1)
    public void insertAtHead(int value) {
        Node node = new Node(value);    // Create new node
        node.next = this.head;          // Link to current head
        this.head = node;               // Update head
        this.size++;                    // Increment size
    }
    
    // INSERT AT TAIL: Add node at end - O(n)
    public void insertAtTail(int value) {
        Node node = new Node(value);    // Create new node
        if (this.head == null) {        // If empty
            this.head = node;           // New node is head
        } else {
            Node current = this.head;   // Start from head
            while (current.next != null) { // Find end
                current = current.next; // Move forward
            }
            current.next = node;        // Attach to end
        }
        this.size++;                    // Increment size
    }
    
    // DELETE FROM HEAD: Remove first node - O(1)
    public int deleteFromHead() {
        if (this.head == null) return -1; // Empty list
        int value = this.head.value;    // Get value
        this.head = this.head.next;     // Move head forward
        this.size--;                    // Decrement size
        return value;
    }
    
    // SEARCH: Find value in list - O(n)
    public int search(int value) {
        Node current = this.head;       // Start from head
        int position = 0;
        while (current != null) {       // Traverse
            if (current.value == value) { // Found
                return position;        // Return position
            }
            current = current.next;     // Move forward
            position++;
        }
        return -1;                      // Not found
    }
    
    // GET SIZE: Return number of nodes - O(1)
    public int getSize() {
        return this.size;
    }
}

// Usage:
LinkedList list = new LinkedList();
list.insertAtHead(10); list.insertAtTail(20); list.insertAtTail(30);
System.out.println(list.search(20)); // 1 (position)
System.out.println(list.getSize()); // 3`,

  cpp: `// ===== SINGLY LINKED LIST: C++ =====
// Each node contains value and pointer to next node

#include <iostream>
using namespace std;

struct Node {
    // Node structure with value and pointer
    int value;              // Data stored in node
    Node* next;             // Pointer to next node
    
    Node(int val) {         // Constructor
        value = val;        // Initialize value
        next = nullptr;     // Initialize pointer
    }
};

class LinkedList {
private:
    Node* head;             // Head pointer
    int size;               // Number of nodes
    
public:
    // Initialize: Create empty linked list
    LinkedList() {
        head = nullptr;     // Start with null head
        size = 0;           // Start with 0 nodes
    }
    
    // INSERT AT HEAD: Add node at beginning - O(1)
    void insertAtHead(int value) {
        Node* node = new Node(value);   // Create new node
        node->next = head;              // Link to current head
        head = node;                    // Update head
        size++;                         // Increment size
    }
    
    // INSERT AT TAIL: Add node at end - O(n)
    void insertAtTail(int value) {
        Node* node = new Node(value);   // Create new node
        if (head == nullptr) {          // If empty
            head = node;                // New node is head
        } else {
            Node* current = head;       // Start from head
            while (current->next != nullptr) { // Find end
                current = current->next; // Move forward
            }
            current->next = node;       // Attach to end
        }
        size++;                         // Increment size
    }
    
    // DELETE FROM HEAD: Remove first node - O(1)
    int deleteFromHead() {
        if (head == nullptr) return -1; // Empty list
        int value = head->value;        // Get value
        Node* temp = head;              // Save head
        head = head->next;              // Move head forward
        delete temp;                    // Free memory
        size--;                         // Decrement size
        return value;
    }
    
    // SEARCH: Find value in list - O(n)
    int search(int value) {
        Node* current = head;           // Start from head
        int position = 0;
        while (current != nullptr) {    // Traverse
            if (current->value == value) { // Found
                return position;        // Return position
            }
            current = current->next;    // Move forward
            position++;
        }
        return -1;                      // Not found
    }
    
    // GET SIZE: Return number of nodes - O(1)
    int getSize() {
        return size;
    }
};

// Usage:
int main() {
    LinkedList list;
    list.insertAtHead(10); list.insertAtTail(20); list.insertAtTail(30);
    cout << list.search(20) << endl;  // 1 (position)
    cout << list.getSize() << endl;   // 3
    return 0;
}`,

  c: `// ===== SINGLY LINKED LIST: C =====
// Using malloc/free for dynamic memory allocation

#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int value;              // Data stored in node
    struct Node* next;      // Pointer to next node
} Node;

typedef struct {
    Node* head;             // Head pointer
    int size;               // Number of nodes
} LinkedList;

// Initialize: Create empty linked list
LinkedList* createList() {
    LinkedList* list = (LinkedList*)malloc(sizeof(LinkedList));
    list->head = NULL;      // Start with NULL head
    list->size = 0;         // Start with 0 nodes
    return list;
}

// INSERT AT HEAD: Add node at beginning - O(1)
void insertAtHead(LinkedList* list, int value) {
    Node* node = (Node*)malloc(sizeof(Node));  // Create new node
    node->value = value;    // Set value
    node->next = list->head; // Link to current head
    list->head = node;      // Update head
    list->size++;           // Increment size
}

// INSERT AT TAIL: Add node at end - O(n)
void insertAtTail(LinkedList* list, int value) {
    Node* node = (Node*)malloc(sizeof(Node));  // Create new node
    node->value = value;    // Set value
    node->next = NULL;      // Initialize next to NULL
    
    if (list->head == NULL) { // If empty
        list->head = node;  // New node is head
    } else {
        Node* current = list->head; // Start from head
        while (current->next != NULL) { // Find end
            current = current->next; // Move forward
        }
        current->next = node; // Attach to end
    }
    list->size++;           // Increment size
}

// DELETE FROM HEAD: Remove first node - O(1)
int deleteFromHead(LinkedList* list) {
    if (list->head == NULL) return -1; // Empty list
    int value = list->head->value;     // Get value
    Node* temp = list->head;           // Save head
    list->head = list->head->next;     // Move head forward
    free(temp);                        // Free memory
    list->size--;                      // Decrement size
    return value;
}

// SEARCH: Find value in list - O(n)
int search(LinkedList* list, int value) {
    Node* current = list->head;        // Start from head
    int position = 0;
    while (current != NULL) {          // Traverse
        if (current->value == value) { // Found
            return position;           // Return position
        }
        current = current->next;       // Move forward
        position++;
    }
    return -1;                         // Not found
}

// GET SIZE: Return number of nodes - O(1)
int getSize(LinkedList* list) {
    return list->size;
}

// Usage:
int main() {
    LinkedList* list = createList();
    insertAtHead(list, 10);
    insertAtTail(list, 20);
    insertAtTail(list, 30);
    printf("%d\\n", search(list, 20));  // 1 (position)
    printf("%d\\n", getSize(list));    // 3
    return 0;
}`,

  csharp: `// ===== SINGLY LINKED LIST: C# =====
// Using LinkedList<T> generic class from System.Collections.Generic

using System;
using System.Collections.Generic;

class LinkedListExample {
    // Using built-in LinkedList<T> class (highly optimized)
    static void Main() {
        LinkedList<int> list = new LinkedList<int>(); // Create list
        
        // INSERT AT HEAD: Add to beginning - O(1)
        LinkedListNode<int> head1 = list.AddFirst(10);  // Add 10 at head
        
        // INSERT AT TAIL: Add to end - O(1) with AddLast
        list.AddLast(20);                              // Add 20 at tail
        list.AddLast(30);                              // Add 30 at tail
        
        // TRAVERSE: Get values
        foreach (int val in list) {
            Console.WriteLine(val);  // 10, 20, 30
        }
        
        // DELETE FROM HEAD: Remove first node - O(1)
        if (list.First != null) {
            list.RemoveFirst();      // Remove head
        }
        
        // SEARCH: Find value - O(n)
        LinkedListNode<int> found = list.Find(20); // Search for 20
        Console.WriteLine(found != null ? "Found" : "Not found");
        
        // GET SIZE: Return count - O(1)
        Console.WriteLine(list.Count); // 2
    }
}

// Manual implementation (educational):
class Node {
    public int value;           // Data stored in node
    public Node next;           // Pointer to next node
    
    public Node(int value) {
        this.value = value;     // Initialize value
        this.next = null;       // Initialize pointer
    }
}

class ManualLinkedList {
    private Node head;          // Head pointer
    private int size;           // Number of nodes
    
    public ManualLinkedList() {
        this.head = null;       // Start with null head
        this.size = 0;          // Start with 0 nodes
    }
    
    // INSERT AT HEAD: Add node at beginning - O(1)
    public void InsertAtHead(int value) {
        Node node = new Node(value); // Create new node
        node.next = this.head;       // Link to current head
        this.head = node;            // Update head
        this.size++;                 // Increment size
    }
    
    // DELETE FROM HEAD: Remove first node - O(1)
    public int DeleteFromHead() {
        if (this.head == null) return -1; // Empty list
        int value = this.head.value; // Get value
        this.head = this.head.next;  // Move head forward
        this.size--;                 // Decrement size
        return value;
    }
    
    // GET SIZE - O(1)
    public int GetSize() {
        return this.size;
    }
}`,

  go: `// ===== SINGLY LINKED LIST: GO =====
// Using structs and pointers for node implementation

package main
import "fmt"

type Node struct {
    value int        // Data stored in node
    next  *Node      // Pointer to next node
}

type LinkedList struct {
    head *Node      // Head pointer
    size int        // Number of nodes
}

// Initialize: Create empty linked list
func NewLinkedList() *LinkedList {
    return &LinkedList{
        head: nil,  // Start with nil head
        size: 0,    // Start with 0 nodes
    }
}

// INSERT AT HEAD: Add node at beginning - O(1)
func (l *LinkedList) InsertAtHead(value int) {
    node := &Node{value: value} // Create new node
    node.next = l.head          // Link to current head
    l.head = node               // Update head
    l.size++                    // Increment size
}

// INSERT AT TAIL: Add node at end - O(n)
func (l *LinkedList) InsertAtTail(value int) {
    node := &Node{value: value} // Create new node
    
    if l.head == nil {          // If empty
        l.head = node           // New node is head
    } else {
        current := l.head       // Start from head
        for current.next != nil { // Find end
            current = current.next // Move forward
        }
        current.next = node     // Attach to end
    }
    l.size++                    // Increment size
}

// DELETE FROM HEAD: Remove first node - O(1)
func (l *LinkedList) DeleteFromHead() int {
    if l.head == nil {          // Empty list
        return -1
    }
    value := l.head.value       // Get value
    l.head = l.head.next        // Move head forward
    l.size--                    // Decrement size
    return value
}

// SEARCH: Find value in list - O(n)
func (l *LinkedList) Search(value int) int {
    current := l.head           // Start from head
    position := 0
    for current != nil {        // Traverse
        if current.value == value { // Found
            return position     // Return position
        }
        current = current.next  // Move forward
        position++
    }
    return -1                   // Not found
}

// GET SIZE: Return number of nodes - O(1)
func (l *LinkedList) GetSize() int {
    return l.size
}

// Usage:
func main() {
    list := NewLinkedList()
    list.InsertAtHead(10)
    list.InsertAtTail(20)
    list.InsertAtTail(30)
    fmt.Println(list.Search(20))  // 1 (position)
    fmt.Println(list.GetSize())   // 3
}`,

  rust: `// ===== SINGLY LINKED LIST: RUST =====
// Using Box<T> for heap allocation and Option for nullable pointers

use std::fmt;

#[derive(Debug)]
struct Node {
    value: i32,                  // Data stored in node
    next: Option<Box<Node>>,     // Pointer to next node (Option handles null)
}

impl Node {
    // Node constructor: Create new node
    fn new(value: i32) -> Self {
        Node {
            value,               // Set value
            next: None,          // Initially no next node
        }
    }
}

struct LinkedList {
    head: Option<Box<Node>>,     // Head pointer (Option for optional)
    size: usize,                 // Number of nodes
}

impl LinkedList {
    // Initialize: Create empty linked list
    fn new() -> Self {
        LinkedList {
            head: None,          // Start with None
            size: 0,             // Start with 0 nodes
        }
    }
    
    // INSERT AT HEAD: Add node at beginning - O(1)
    fn insert_at_head(&mut self, value: i32) {
        let mut node = Box::new(Node::new(value)); // Create new node
        node.next = self.head.take();  // Current head becomes new node's next
        self.head = Some(node);        // New node becomes head
        self.size += 1;                // Increment size
    }
    
    // INSERT AT TAIL: Add node at end - O(n)
    fn insert_at_tail(&mut self, value: i32) {
        let node = Box::new(Node::new(value)); // Create new node
        
        if self.head.is_none() {       // If empty
            self.head = Some(node);    // New node is head
        } else {
            // Navigate to end
            let mut current = &mut self.head;
            while current.as_ref().unwrap().next.is_some() {
                current = &mut current.as_mut().unwrap().next;
            }
            current.as_mut().unwrap().next = Some(node); // Attach
        }
        self.size += 1;                // Increment size
    }
    
    // DELETE FROM HEAD: Remove first node - O(1)
    fn delete_from_head(&mut self) -> Option<i32> {
        match self.head.take() {       // Take ownership
            Some(node) => {            // If not empty
                self.head = node.next; // Move to next
                self.size -= 1;        // Decrement size
                Some(node.value)       // Return value
            }
            None => None               // Empty list
        }
    }
    
    // GET SIZE: Return number of nodes - O(1)
    fn get_size(&self) -> usize {
        self.size
    }
}

// Usage:
fn main() {
    let mut list = LinkedList::new();
    list.insert_at_head(10);
    list.insert_at_tail(20);
    list.insert_at_tail(30);
    println!("Size: {}", list.get_size());  // 3
    println!("{:?}", list.head);            // Debug output
}`,
};

export default CODE_SNIPPETS;
