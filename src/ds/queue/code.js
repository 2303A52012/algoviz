// ===== QUEUE DATA STRUCTURE: 8-LANGUAGE IMPLEMENTATIONS =====
// A Queue is a FIFO (First In First Out) data structure.
// Elements are added at the REAR and removed from the FRONT.
// Common operations: Enqueue (add), Dequeue (remove), Peek (view front)

export const CODE_SNIPPETS = {
  javascript: `// ===== QUEUE: JAVASCRIPT =====
// Queue using array - operations at front and rear
class Queue {
  // Initialize: Create empty queue with front and rear pointers
  constructor() {
    this.items = [];
    this.front = 0;
  }

  // ENQUEUE: Add element to rear of queue - O(1)
  enqueue(element) {
    this.items.push(element); // Add to end (rear)
  }

  // DEQUEUE: Remove element from front of queue - O(1)
  dequeue() {
    if (this.isEmpty()) return undefined; // Check if empty
    return this.items[this.front++]; // Return front element, move pointer
  }

  // PEEK: View front element without removing - O(1)
  peek() {
    if (this.isEmpty()) return undefined; // Check if empty
    return this.items[this.front]; // Return front element only
  }

  // isEmpty: Check if queue is empty - O(1)
  isEmpty() {
    return this.front >= this.items.length; // Front passed rear means empty
  }

  // SIZE: Get current size of queue - O(1)
  size() {
    return this.items.length - this.front; // Count active elements
  }
}

// Usage:
const queue = new Queue();
queue.enqueue(10); queue.enqueue(20); queue.enqueue(30);
console.log(queue.peek()); // Output: 10 (front element)
console.log(queue.dequeue()); // Output: 10 (remove front)
console.log(queue.size()); // Output: 2`,

  python: `# ===== QUEUE: PYTHON =====
# Queue using collections.deque for efficient O(1) operations
from collections import deque

class Queue:
    # Initialize: Create empty queue using deque (doubly-ended queue)
    def __init__(self):
        self.items = deque() # Optimized for adding/removing both ends
    
    # ENQUEUE: Add element to rear of queue - O(1)
    def enqueue(self, element):
        self.items.append(element) # Add to right end (rear)
    
    # DEQUEUE: Remove element from front of queue - O(1)
    def dequeue(self):
        if self.isEmpty(): # Check if empty first
            return None # Cannot dequeue from empty queue
        return self.items.popleft() # Remove and return from left end (front)
    
    # PEEK: View front element without removing - O(1)
    def peek(self):
        if self.isEmpty(): # Check if empty first
            return None # Nothing to peek
        return self.items[0] # Return leftmost element (front)
    
    # isEmpty: Check if queue is empty - O(1)
    def isEmpty(self):
        return len(self.items) == 0 # True if no elements
    
    # SIZE: Get current size of queue - O(1)
    def size(self):
        return len(self.items) # Return element count

# Usage:
queue = Queue()
queue.enqueue(10)
queue.enqueue(20)
queue.enqueue(30)
print(queue.peek()) # Output: 10 (front element)
print(queue.dequeue()) # Output: 10 (remove front)
print(queue.size()) # Output: 2`,

  java: `// ===== QUEUE: JAVA =====
// Queue using LinkedList for efficient O(1) Enqueue/Dequeue
import java.util.*;

public class Queue {
    private LinkedList<Integer> items;
    
    // Initialize: Create empty queue using LinkedList
    public Queue() {
        this.items = new LinkedList<>(); // LinkedList optimal for queue operations
    }
    
    // ENQUEUE: Add element to rear of queue - O(1)
    public void enqueue(int element) {
        this.items.addLast(element); // Add to end (rear)
    }
    
    // DEQUEUE: Remove element from front of queue - O(1)
    public Integer dequeue() {
        if (this.isEmpty()) { // Check if empty first
            return null; // Cannot dequeue from empty queue
        }
        return this.items.removeFirst(); // Remove and return from front
    }
    
    // PEEK: View front element without removing - O(1)
    public Integer peek() {
        if (this.isEmpty()) { // Check if empty first
            return null; // Nothing to peek at
        }
        return this.items.getFirst(); // Return front element only
    }
    
    // isEmpty: Check if queue is empty - O(1)
    public boolean isEmpty() {
        return this.items.size() == 0; // True if no elements
    }
    
    // SIZE: Get current size of queue - O(1)
    public int size() {
        return this.items.size(); // Return element count
    }
}

// Usage:
Queue queue = new Queue();
queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);
System.out.println(queue.peek()); // Output: 10 (front element)
System.out.println(queue.dequeue()); // Output: 10 (remove front)
System.out.println(queue.size()); // Output: 2`,

  cpp: `// ===== QUEUE: C++ =====
// Queue using std::queue from Standard Template Library
#include <iostream>
#include <queue>
using namespace std;

// Class: Custom Queue implementation
class Queue {
private:
    queue<int> items; // STL queue container
    
public:
    // ENQUEUE: Add element to rear - O(1)
    void enqueue(int element) {
        items.push(element); // Add to rear
    }
    
    // DEQUEUE: Remove element from front - O(1)
    int dequeue() {
        if (isEmpty()) { // Check if empty first
            return -1; // Cannot dequeue from empty queue
        }
        int front = items.front(); // Get front element
        items.pop(); // Remove from front
        return front; // Return removed element
    }
    
    // PEEK: View front element without removing - O(1)
    int peek() {
        if (isEmpty()) { // Check if empty first
            return -1; // Nothing to peek at
        }
        return items.front(); // Return front element
    }
    
    // isEmpty: Check if queue is empty - O(1)
    bool isEmpty() {
        return items.empty(); // True if size is 0
    }
    
    // SIZE: Get current size - O(1)
    int size() {
        return items.size(); // Return element count
    }
};

// Usage:
int main() {
    Queue queue;
    queue.enqueue(10);
    queue.enqueue(20);
    queue.enqueue(30);
    cout << queue.peek() << endl; // Output: 10 (front)
    cout << queue.dequeue() << endl; // Output: 10 (remove front)
    cout << queue.size() << endl; // Output: 2
    return 0;
}`,

  c: `// ===== QUEUE: C =====
// Queue using array with front and rear pointers
#include <stdio.h>
#define MAX_SIZE 100

// Struct: Define Queue structure
typedef struct {
    int items[MAX_SIZE]; // Array to store elements
    int front; // Index of front element
    int rear; // Index of rear element
} Queue;

// Initialize: Create empty queue
Queue* createQueue() {
    Queue* queue = (Queue*)malloc(sizeof(Queue)); // Allocate memory
    queue->front = -1; // No front element initially
    queue->rear = -1; // No rear element initially
    return queue;
}

// ENQUEUE: Add element to rear - O(1)
void enqueue(Queue* queue, int element) {
    if (queue->rear == MAX_SIZE - 1) { // Check if full
        printf("Queue overflow!\\n");
        return;
    }
    if (queue->front == -1) queue->front = 0; // First element
    queue->items[++queue->rear] = element; // Increment rear, add element
}

// DEQUEUE: Remove element from front - O(1)
int dequeue(Queue* queue) {
    if (queue->front == -1 || queue->front > queue->rear) { // Check if empty
        printf("Queue underflow!\\n");
        return -1;
    }
    int element = queue->items[queue->front++]; // Get front, increment
    return element; // Return removed element
}

// PEEK: View front element - O(1)
int peek(Queue* queue) {
    if (queue->front == -1 || queue->front > queue->rear) { // Check if empty
        printf("Queue is empty!\\n");
        return -1;
    }
    return queue->items[queue->front]; // Return front without removal
}

// isEmpty: Check if empty - O(1)
int isEmpty(Queue* queue) {
    return queue->front == -1 || queue->front > queue->rear; // True if empty
}

// Usage:
int main() {
    Queue* queue = createQueue();
    enqueue(queue, 10);
    enqueue(queue, 20);
    enqueue(queue, 30);
    printf("%d\\n", peek(queue)); // Output: 10 (front)
    printf("%d\\n", dequeue(queue)); // Output: 10 (remove front)
    return 0;
}`,

  csharp: `// ===== QUEUE: C# =====
// Queue using Queue<T> from System.Collections.Generic
using System;
using System.Collections.Generic;

public class Queue {
    private Queue<int> items;
    
    // Initialize: Create empty queue using built-in Queue<T>
    public Queue() {
        this.items = new Queue<int>(); // Generic queue collection
    }
    
    // ENQUEUE: Add element to rear - O(1)
    public void Enqueue(int element) {
        items.Enqueue(element); // Add to rear
    }
    
    // DEQUEUE: Remove element from front - O(1)
    public int? Dequeue() {
        if (IsEmpty()) { // Check if empty first
            return null; // Cannot dequeue from empty queue
        }
        return items.Dequeue(); // Remove and return front element
    }
    
    // PEEK: View front element without removing - O(1)
    public int? Peek() {
        if (IsEmpty()) { // Check if empty first
            return null; // Nothing to peek at
        }
        return items.Peek(); // Return front element only
    }
    
    // IsEmpty: Check if queue is empty - O(1)
    public bool IsEmpty() {
        return items.Count == 0; // True if no elements
    }
    
    // Size: Get current size - O(1)
    public int Size() {
        return items.Count; // Return element count
    }
}

// Usage:
public class Program {
    public static void Main() {
        Queue queue = new Queue();
        queue.Enqueue(10);
        queue.Enqueue(20);
        queue.Enqueue(30);
        Console.WriteLine(queue.Peek()); // Output: 10 (front)
        Console.WriteLine(queue.Dequeue()); // Output: 10 (remove front)
        Console.WriteLine(queue.Size()); // Output: 2
    }
}`,

  go: `// ===== QUEUE: GO =====
// Queue using slices and managing front pointer
package main

import "fmt"

// Queue: Struct for queue with items and front pointer
type Queue struct {
    items []int // Slice to store elements
    front int   // Index of front element
}

// NewQueue: Create new empty queue
func NewQueue() *Queue {
    return &Queue{
        items: make([]int, 0), // Empty slice
        front: 0, // Front starts at 0
    }
}

// Enqueue: Add element to rear - O(1) amortized
func (q *Queue) Enqueue(element int) {
    q.items = append(q.items, element) // Add to end (rear)
}

// Dequeue: Remove element from front - O(1)
func (q *Queue) Dequeue() (int, bool) {
    if q.IsEmpty() { // Check if empty
        return 0, false // Cannot dequeue from empty queue
    }
    element := q.items[q.front] // Get front element
    q.front++ // Move front pointer forward
    return element, true // Return element and success flag
}

// Peek: View front element without removing - O(1)
func (q *Queue) Peek() (int, bool) {
    if q.IsEmpty() { // Check if empty
        return 0, false // Nothing to peek at
    }
    return q.items[q.front], true // Return front element and success
}

// IsEmpty: Check if queue is empty - O(1)
func (q *Queue) IsEmpty() bool {
    return q.front >= len(q.items) // True if front passed all elements
}

// Size: Get current queue size - O(1)
func (q *Queue) Size() int {
    return len(q.items) - q.front // Count active elements
}

// Usage:
func main() {
    queue := NewQueue()
    queue.Enqueue(10)
    queue.Enqueue(20)
    queue.Enqueue(30)
    
    if val, ok := queue.Peek(); ok { // Safe peek with error handling
        fmt.Println(val) // Output: 10 (front element)
    }
    
    if val, ok := queue.Dequeue(); ok { // Safe dequeue
        fmt.Println(val) // Output: 10 (removed element)
    }
    
    fmt.Println(queue.Size()) // Output: 2
}`,

  rust: `// ===== QUEUE: RUST =====
// Queue using VecDeque for efficient O(1) operations
use std::collections::VecDeque;

// Queue: Wrapper around VecDeque for FIFO operations
pub struct Queue {
    items: VecDeque<i32>, // Double-ended queue: O(1) push/pop both ends
}

impl Queue {
    // new: Create empty queue
    pub fn new() -> Self {
        Queue {
            items: VecDeque::new(), // Initialize empty deque
        }
    }

    // enqueue: Add element to rear - O(1)
    pub fn enqueue(&mut self, element: i32) {
        self.items.push_back(element); // Add to rear
    }

    // dequeue: Remove element from front - O(1)
    pub fn dequeue(&mut self) -> Option<i32> {
        self.items.pop_front() // Remove and return from front, Option enum
    }

    // peek: View front element without removing - O(1)
    pub fn peek(&self) -> Option<&i32> {
        self.items.front() // Return reference to front, Option enum
    }

    // is_empty: Check if queue is empty - O(1)
    pub fn is_empty(&self) -> bool {
        self.items.is_empty() // True if no elements
    }

    // size: Get current queue size - O(1)
    pub fn size(&self) -> usize {
        self.items.len() // Return element count
    }
}

// Usage:
fn main() {
    let mut queue = Queue::new();
    queue.enqueue(10);
    queue.enqueue(20);
    queue.enqueue(30);
    
    if let Some(front) = queue.peek() { // Safe pattern matching
        println!("{}", front); // Output: 10 (front element)
    }
    
    if let Some(element) = queue.dequeue() { // Safe dequeue
        println!("{}", element); // Output: 10 (removed element)
    }
    
    println!("{}", queue.size()); // Output: 2
}`,
};
