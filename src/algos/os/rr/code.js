export const CODE_SNIPPETS = {
  javascript: `// ===== ROUND ROBIN SCHEDULING =====
function roundRobinScheduling(processes, quantum) {
  let n = processes.length, completed = 0, time = 0;
  let remaining = processes.map(p => p.burst);
  let queue = [];
  let inQueue = new Array(n).fill(false);
  
  // Enqueue initial arrivals
  for (let i = 0; i < n; i++) {
    if (processes[i].arrival <= time) {
      queue.push(i);
      inQueue[i] = true;
    }
  }
  
  while (completed < n) {
    if (queue.length === 0) {
      time++;
      // Check for arrivals during idle time
      for (let i = 0; i < n; i++) {
        if (processes[i].arrival <= time && !inQueue[i] && remaining[i] > 0) {
          queue.push(i);
          inQueue[i] = true;
        }
      }
      continue;
    }
    
    let idx = queue.shift();
    if (processes[idx].startTime === undefined || processes[idx].startTime === -1) {
      processes[idx].startTime = time;
    }
    
    let slice = Math.min(quantum, remaining[idx]);
    remaining[idx] -= slice;
    time += slice;
    
    // Add processes that arrived during this quantum
    for (let i = 0; i < n; i++) {
      if (processes[i].arrival <= time && !inQueue[i] && remaining[i] > 0) {
        queue.push(i);
        inQueue[i] = true;
      }
    }
    
    if (remaining[idx] === 0) {
      processes[idx].endTime = time;
      processes[idx].tat = processes[idx].endTime - processes[idx].arrival;
      processes[idx].wt = processes[idx].tat - processes[idx].burst;
      completed++;
    } else {
      queue.push(idx); // Put back at end of ready queue
    }
  }
  return processes;
}`,
  python: `# ===== ROUND ROBIN SCHEDULING =====
def round_robin_scheduling(processes, quantum):
    n = len(processes)
    completed = 0
    time = 0
    remaining = [p['burst'] for p in processes]
    queue = []
    in_queue = [False] * n
    
    for i in range(n):
        if processes[i]['arrival'] <= time:
            queue.append(i)
            in_queue[i] = True
            
    while completed < n:
        if not queue:
            time += 1
            for i in range(n):
                if processes[i]['arrival'] <= time and not in_queue[i] and remaining[i] > 0:
                    queue.append(i)
                    in_queue[i] = True
            continue
            
        idx = queue.pop(0)
        if 'start_time' not in processes[idx] or processes[idx]['start_time'] == -1:
            processes[idx]['start_time'] = time
            
        slice_time = min(quantum, remaining[idx])
        remaining[idx] -= slice_time
        time += slice_time
        
        for i in range(n):
            if processes[i]['arrival'] <= time and not in_queue[i] and remaining[i] > 0:
                queue.append(i)
                in_queue[i] = True
                
        if remaining[idx] == 0:
            processes[idx]['end_time'] = time
            processes[idx]['tat'] = processes[idx]['end_time'] - processes[idx]['arrival']
            processes[idx]['wt'] = processes[idx]['tat'] - processes[idx]['burst']
            completed += 1
        else:
            queue.append(idx)
    return processes`,
  java: `// ===== ROUND ROBIN SCHEDULING =====
import java.util.*;

class Process {
    String pid;
    int arrival, burst, startTime = -1, endTime, wt, tat, remaining;
    Process(String pid, int arrival, int burst) {
        this.pid = pid; this.arrival = arrival; this.burst = burst; this.remaining = burst;
    }
}

public class RoundRobinScheduling {
    public static void schedule(List<Process> processes, int quantum) {
        int n = processes.size(), completed = 0, time = 0;
        Queue<Integer> queue = new LinkedList<>();
        boolean[] inQueue = new boolean[n];
        
        for (int i = 0; i < n; i++) {
            if (processes.get(i).arrival <= time) {
                queue.add(i);
                inQueue[i] = true;
            }
        }
        
        while (completed < n) {
            if (queue.isEmpty()) {
                time++;
                for (int i = 0; i < n; i++) {
                    if (processes.get(i).arrival <= time && !inQueue[i] && processes.get(i).remaining > 0) {
                        queue.add(i);
                        inQueue[i] = true;
                    }
                }
                continue;
            }
            int idx = queue.poll();
            Process p = processes.get(idx);
            if (p.startTime == -1) p.startTime = time;
            
            int slice = Math.min(quantum, p.remaining);
            p.remaining -= slice;
            time += slice;
            
            for (int i = 0; i < n; i++) {
                if (processes.get(i).arrival <= time && !inQueue[i] && processes.get(i).remaining > 0) {
                    queue.add(i);
                    inQueue[i] = true;
                }
            }
            
            if (p.remaining == 0) {
                p.endTime = time;
                p.tat = p.endTime - p.arrival;
                p.wt = p.tat - p.burst;
                completed++;
            } else {
                queue.add(idx);
            }
        }
    }
}`,
  cpp: `// ===== ROUND ROBIN SCHEDULING =====
#include <iostream>
#include <vector>
#include <queue>
#include <algorithm>

struct Process {
    std::string pid;
    int arrival, burst, startTime = -1, endTime, wt, tat, remaining;
};

void roundRobinScheduling(std::vector<Process>& processes, int quantum) {
    int n = processes.size(), completed = 0, time = 0;
    std::queue<int> q;
    std::vector<bool> inQueue(n, false);
    for (auto& p : processes) p.remaining = p.burst;
    
    for (int i = 0; i < n; i++) {
        if (processes[i].arrival <= time) {
            q.push(i);
            inQueue[i] = true;
        }
    }
    
    while (completed < n) {
        if (q.empty()) {
            time++;
            for (int i = 0; i < n; i++) {
                if (processes[i].arrival <= time && !inQueue[i] && processes[i].remaining > 0) {
                    q.push(i);
                    inQueue[i] = true;
                }
            }
            continue;
        }
        int idx = q.front(); q.pop();
        Process& p = processes[idx];
        if (p.startTime == -1) p.startTime = time;
        
        int slice = std::min(quantum, p.remaining);
        p.remaining -= slice;
        time += slice;
        
        for (int i = 0; i < n; i++) {
            if (processes[i].arrival <= time && !inQueue[i] && processes[i].remaining > 0) {
                q.push(i);
                inQueue[i] = true;
            }
        }
        
        if (p.remaining == 0) {
            p.endTime = time;
            p.tat = p.endTime - p.arrival;
            p.wt = p.tat - p.burst;
            completed++;
        } else {
            q.push(idx);
        }
    }
}`,
  c: `// ===== ROUND ROBIN SCHEDULING =====
#include <stdio.h>
#include <stdbool.h>

typedef struct {
    char pid[10];
    int arrival, burst, startTime, endTime, wt, tat, remaining;
} Process;

void roundRobinScheduling(Process arr[], int n, int quantum) {
    int completed = 0, time = 0;
    int queue[100], head = 0, tail = 0;
    bool inQueue[100] = {false};
    
    for (int i = 0; i < n; i++) {
        arr[i].remaining = arr[i].burst;
        arr[i].startTime = -1;
    }
    
    for (int i = 0; i < n; i++) {
        if (arr[i].arrival <= time) {
            queue[tail++] = i;
            inQueue[i] = true;
        }
    }
    
    while (completed < n) {
        if (head == tail) {
            time++;
            for (int i = 0; i < n; i++) {
                if (arr[i].arrival <= time && !inQueue[i] && arr[i].remaining > 0) {
                    queue[tail++] = i;
                    inQueue[i] = true;
                }
            }
            continue;
        }
        int idx = queue[head++];
        if (arr[idx].startTime == -1) arr[idx].startTime = time;
        
        int slice = (quantum < arr[idx].remaining) ? quantum : arr[idx].remaining;
        arr[idx].remaining -= slice;
        time += slice;
        
        for (int i = 0; i < n; i++) {
            if (arr[i].arrival <= time && !inQueue[i] && arr[i].remaining > 0) {
                queue[tail++] = i;
                inQueue[i] = true;
            }
        }
        
        if (arr[idx].remaining == 0) {
            arr[idx].endTime = time;
            arr[idx].tat = arr[idx].endTime - arr[idx].arrival;
            arr[idx].wt = arr[idx].tat - arr[idx].burst;
            completed++;
        } else {
            queue[tail++] = idx;
        }
    }
}`,
  csharp: `// ===== ROUND ROBIN SCHEDULING =====
using System;
using System.Collections.Generic;

public class Process {
    public string Pid;
    public int Arrival, Burst, StartTime = -1, EndTime, WT, TAT, Remaining;
}

public class RoundRobinScheduling {
    public static void Schedule(List<Process> processes, int quantum) {
        int n = processes.Count, completed = 0, time = 0;
        Queue<int> q = new Queue<int>();
        bool[] inQueue = new bool[n];
        foreach (var p in processes) p.Remaining = p.Burst;
        
        for (int i = 0; i < n; i++) {
            if (processes[i].Arrival <= time) {
                q.Enqueue(i);
                inQueue[i] = true;
            }
        }
        
        while (completed < n) {
            if (q.Count == 0) {
                time++;
                for (int i = 0; i < n; i++) {
                    if (processes[i].Arrival <= time && !inQueue[i] && processes[i].Remaining > 0) {
                        q.Enqueue(i);
                        inQueue[i] = true;
                    }
                }
                continue;
            }
            int idx = q.Dequeue();
            var p = processes[idx];
            if (p.StartTime == -1) p.StartTime = time;
            
            int slice = Math.Min(quantum, p.Remaining);
            p.Remaining -= slice;
            time += slice;
            
            for (int i = 0; i < n; i++) {
                if (processes[i].Arrival <= time && !inQueue[i] && processes[i].Remaining > 0) {
                    q.Enqueue(i);
                    inQueue[i] = true;
                }
            }
            
            if (p.Remaining == 0) {
                p.EndTime = time;
                p.TAT = p.EndTime - p.Arrival;
                p.WT = p.TAT - p.Burst;
                completed++;
            } else {
                q.Enqueue(idx);
            }
        }
    }
}`,
  go: `// ===== ROUND ROBIN SCHEDULING =====
package main

type Process struct {
	Pid string
	Arrival, Burst, StartTime, EndTime, WT, TAT, Remaining int
}

func RoundRobinScheduling(processes []Process, quantum int) {
	n := len(processes)
	for i := range processes {
		processes[i].Remaining = processes[i].Burst
		processes[i].StartTime = -1
	}
	completed, time := 0, 0
	var queue []int
	inQueue := make([]bool, n)
	
	for i := 0; i < n; i++ {
		if processes[i].Arrival <= time {
			queue = append(queue, i)
			inQueue[i] = true
		}
	}
	
	for completed < n {
		if len(queue) == 0 {
			time++
			for i := 0; i < n; i++ {
				if processes[i].Arrival <= time && !inQueue[i] && processes[i].Remaining > 0 {
					queue = append(queue, i)
					inQueue[i] = true
				}
			}
			continue
		}
		idx := queue[0]
		queue = queue[1:]
		p := &processes[idx]
		if p.StartTime == -1 {
			p.StartTime = time
		}
		
		slice := quantum
		if p.Remaining < quantum {
			slice = p.Remaining
		}
		p.Remaining -= slice
		time += slice
		
		for i := 0; i < n; i++ {
			if processes[i].Arrival <= time && !inQueue[i] && processes[i].Remaining > 0 {
				queue = append(queue, i)
				inQueue[i] = true
			}
		}
		
		if p.Remaining == 0 {
			p.EndTime = time
			p.TAT = p.EndTime - p.Arrival
			p.WT = p.TAT - p.Burst
			completed++
		} else {
			queue = append(queue, idx)
		}
	}
}`,
  rust: `// ===== ROUND ROBIN SCHEDULING =====
struct Process {
    pid: String,
    arrival: i32,
    burst: i32,
    start_time: i32,
    end_time: i32,
    wt: i32,
    tat: i32,
    remaining: i32,
}

fn round_robin_scheduling(processes: &mut Vec<Process>, quantum: i32) {
    let n = processes.len();
    for p in processes.iter_mut() {
        p.remaining = p.burst;
        p.start_time = -1;
    }
    let mut completed = 0;
    let mut time = 0;
    let mut queue = Vec::new();
    let mut in_queue = vec![false; n];
    
    for i in 0..n {
        if processes[i].arrival <= time {
            queue.push(i);
            in_queue[i] = true;
        }
    }
    
    while completed < n {
        if queue.is_empty() {
            time += 1;
            for i in 0..n {
                if processes[i].arrival <= time && !in_queue[i] && processes[i].remaining > 0 {
                    queue.push(i);
                    in_queue[i] = true;
                }
            }
            continue;
        }
        let idx = queue.remove(0);
        let p = &mut processes[idx];
        if p.start_time == -1 {
            p.start_time = time;
        }
        
        let slice = std::cmp::min(quantum, p.remaining);
        p.remaining -= slice;
        time += slice;
        
        for i in 0..n {
            if processes[i].arrival <= time && !in_queue[i] && processes[i].remaining > 0 {
                queue.push(i);
                in_queue[i] = true;
            }
        }
        
        let p = &mut processes[idx];
        if p.remaining == 0 {
            p.end_time = time;
            p.tat = p.end_time - p.arrival;
            p.wt = p.tat - p.burst;
            completed += 1;
        } else {
            queue.push(idx);
        }
    }
}`
};
