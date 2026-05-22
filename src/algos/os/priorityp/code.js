export const CODE_SNIPPETS = {
  javascript: `// ===== PREEMPTIVE PRIORITY SCHEDULING =====
function preemptivePriorityScheduling(processes) {
  let n = processes.length, completed = 0, time = 0;
  let remaining = processes.map(p => p.burst);
  let done = new Array(n).fill(false);
  
  while (completed < n) {
    let idx = -1, highestPriority = Infinity; // Lower number = Higher Priority
    for (let i = 0; i < n; i++) {
      if (processes[i].arrival <= time && !done[i] && processes[i].priority < highestPriority) {
        highestPriority = processes[i].priority;
        idx = i;
      }
    }
    if (idx === -1) {
      time++;
    } else {
      if (processes[idx].startTime === undefined || processes[idx].startTime === -1) {
        processes[idx].startTime = time;
      }
      remaining[idx]--;
      time++;
      if (remaining[idx] === 0) {
        processes[idx].endTime = time;
        processes[idx].tat = processes[idx].endTime - processes[idx].arrival;
        processes[idx].wt = processes[idx].tat - processes[idx].burst;
        done[idx] = true;
        completed++;
      }
    }
  }
  return processes;
}`,
  python: `# ===== PREEMPTIVE PRIORITY SCHEDULING =====
def preemptive_priority_scheduling(processes):
    n = len(processes)
    completed = 0
    time = 0
    remaining = [p['burst'] for p in processes]
    done = [False] * n
    
    while completed < n:
        idx = -1
        highest_priority = float('inf')
        for i in range(n):
            if processes[i]['arrival'] <= time and not done[i] and processes[i]['priority'] < highest_priority:
                highest_priority = processes[i]['priority']
                idx = i
        if idx == -1:
            time += 1
        else:
            if 'start_time' not in processes[idx] or processes[idx]['start_time'] == -1:
                processes[idx]['start_time'] = time
            remaining[idx] -= 1
            time += 1
            if remaining[idx] == 0:
                processes[idx]['end_time'] = time
                processes[idx]['tat'] = processes[idx]['end_time'] - processes[idx]['arrival']
                processes[idx]['wt'] = processes[idx]['tat'] - processes[idx]['burst']
                done[idx] = True
                completed += 1
    return processes`,
  java: `// ===== PREEMPTIVE PRIORITY SCHEDULING =====
import java.util.*;

class Process {
    String pid;
    int arrival, burst, priority, startTime = -1, endTime, wt, tat, remaining;
    boolean isDone = false;
    Process(String pid, int arrival, int burst, int priority) {
        this.pid = pid; this.arrival = arrival; this.burst = burst; this.priority = priority; this.remaining = burst;
    }
}

public class PreemptivePriorityScheduling {
    public static void schedule(List<Process> processes) {
        int n = processes.size(), completed = 0, time = 0;
        while (completed < n) {
            int idx = -1, highestPriority = Integer.MAX_VALUE;
            for (int i = 0; i < n; i++) {
                Process p = processes.get(i);
                if (p.arrival <= time && !p.isDone && p.priority < highestPriority) {
                    highestPriority = p.priority;
                    idx = i;
                }
            }
            if (idx == -1) {
                time++;
            } else {
                Process p = processes.get(idx);
                if (p.startTime == -1) p.startTime = time;
                p.remaining--;
                time++;
                if (p.remaining == 0) {
                    p.endTime = time;
                    p.tat = p.endTime - p.arrival;
                    p.wt = p.tat - p.burst;
                    p.isDone = true;
                    completed++;
                }
            }
        }
    }
}`,
  cpp: `// ===== PREEMPTIVE PRIORITY SCHEDULING =====
#include <iostream>
#include <vector>
#include <climits>

struct Process {
    std::string pid;
    int arrival, burst, priority, startTime = -1, endTime, wt, tat, remaining;
    bool isDone = false;
};

void preemptivePriorityScheduling(std::vector<Process>& processes) {
    int n = processes.size(), completed = 0, time = 0;
    for (auto& p : processes) p.remaining = p.burst;
    
    while (completed < n) {
        int idx = -1, highestPriority = INT_MAX;
        for (int i = 0; i < n; i++) {
            if (processes[i].arrival <= time && !processes[i].isDone && processes[i].priority < highestPriority) {
                highestPriority = processes[i].priority;
                idx = i;
            }
        }
        if (idx == -1) {
            time++;
        } else {
            if (processes[idx].startTime == -1) processes[idx].startTime = time;
            processes[idx].remaining--;
            time++;
            if (processes[idx].remaining == 0) {
                processes[idx].endTime = time;
                processes[idx].tat = processes[idx].endTime - processes[idx].arrival;
                processes[idx].wt = processes[idx].tat - processes[idx].burst;
                processes[idx].isDone = true;
                completed++;
            }
        }
    }
}`,
  c: `// ===== PREEMPTIVE PRIORITY SCHEDULING =====
#include <stdio.h>
#include <stdbool.h>
#include <limits.h>

typedef struct {
    char pid[10];
    int arrival, burst, priority, startTime, endTime, wt, tat, remaining;
    bool isDone;
} Process;

void preemptivePriorityScheduling(Process arr[], int n) {
    int completed = 0, time = 0;
    for (int i = 0; i < n; i++) {
        arr[i].remaining = arr[i].burst;
        arr[i].startTime = -1;
        arr[i].isDone = false;
    }
    
    while (completed < n) {
        int idx = -1, highestPriority = INT_MAX;
        for (int i = 0; i < n; i++) {
            if (arr[i].arrival <= time && !arr[i].isDone && arr[i].priority < highestPriority) {
                highestPriority = arr[i].priority;
                idx = i;
            }
        }
        if (idx == -1) {
            time++;
        } else {
            if (arr[idx].startTime == -1) arr[idx].startTime = time;
            arr[idx].remaining--;
            time++;
            if (arr[idx].remaining == 0) {
                arr[idx].endTime = time;
                arr[idx].tat = arr[idx].endTime - arr[idx].arrival;
                arr[idx].wt = arr[idx].tat - arr[idx].burst;
                arr[idx].isDone = true;
                completed++;
            }
        }
    }
}`,
  csharp: `// ===== PREEMPTIVE PRIORITY SCHEDULING =====
using System;
using System.Collections.Generic;

public class Process {
    public string Pid;
    public int Arrival, Burst, Priority, StartTime = -1, EndTime, WT, TAT, Remaining;
    public bool IsDone = false;
}

public class PreemptivePriorityScheduling {
    public static void Schedule(List<Process> processes) {
        int n = processes.Count, completed = 0, time = 0;
        foreach (var p in processes) p.Remaining = p.Burst;
        
        while (completed < n) {
            int idx = -1, highestPriority = int.MaxValue;
            for (int i = 0; i < n; i++) {
                if (processes[i].Arrival <= time && !processes[i].IsDone && processes[i].Priority < highestPriority) {
                    highestPriority = processes[i].Priority;
                    idx = i;
                }
            }
            if (idx == -1) {
                time++;
            } else {
                var p = processes[idx];
                if (p.StartTime == -1) p.StartTime = time;
                p.Remaining--;
                time++;
                if (p.Remaining == 0) {
                    p.EndTime = time;
                    p.TAT = p.EndTime - p.Arrival;
                    p.WT = p.TAT - p.Burst;
                    p.IsDone = true;
                    completed++;
                }
            }
        }
    }
}`,
  go: `// ===== PREEMPTIVE PRIORITY SCHEDULING =====
package main

import "math"

type Process struct {
	Pid string
	Arrival, Burst, Priority, StartTime, EndTime, WT, TAT, Remaining int
	IsDone bool
}

func PreemptivePriorityScheduling(processes []Process) {
	n := len(processes)
	for i := range processes {
		processes[i].Remaining = processes[i].Burst
		processes[i].StartTime = -1
	}
	completed, time := 0, 0
	for completed < n {
		idx := -1
		highestPriority := math.MaxInt32
		for i := 0; i < n; i++ {
			p := &processes[i]
			if p.Arrival <= time && !p.IsDone && p.Priority < highestPriority {
				highestPriority = p.Priority
				idx = i
			}
		}
		if idx == -1 {
			time++
		} else {
			p := &processes[idx]
			if p.StartTime == -1 {
				p.StartTime = time
			}
			p.Remaining--
			time++
			if p.Remaining == 0 {
				p.EndTime = time
				p.TAT = p.EndTime - p.Arrival
				p.WT = p.TAT - p.Burst
				p.IsDone = true
				completed++
			}
		}
	}
}`,
  rust: `// ===== PREEMPTIVE PRIORITY SCHEDULING =====
struct Process {
    pid: String,
    arrival: i32,
    burst: i32,
    priority: i32,
    start_time: i32,
    end_time: i32,
    wt: i32,
    tat: i32,
    remaining: i32,
    is_done: bool,
}

fn preemptive_priority_scheduling(processes: &mut Vec<Process>) {
    let n = processes.len();
    for p in processes.iter_mut() {
        p.remaining = p.burst;
        p.start_time = -1;
    }
    let mut completed = 0;
    let mut time = 0;
    
    while completed < n {
        let mut idx = None;
        let mut highest_priority = i32::MAX;
        for i in 0..n {
            let p = &processes[i];
            if p.arrival <= time && !p.is_done && p.priority < highest_priority {
                highest_priority = p.priority;
                idx = Some(i);
            }
        }
        match idx {
            None => time += 1,
            Some(i) => {
                let p = &mut processes[i];
                if p.start_time == -1 {
                    p.start_time = time;
                }
                p.remaining -= 1;
                time += 1;
                if p.remaining == 0 {
                    p.end_time = time;
                    p.tat = p.end_time - p.arrival;
                    p.wt = p.tat - p.burst;
                    p.is_done = true;
                    completed += 1;
                }
            }
        }
    }
}`
};
