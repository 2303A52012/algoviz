export const CODE_SNIPPETS = {
  javascript: `// ===== SJF SCHEDULING (Non-Preemptive) =====
function sjfScheduling(processes) {
  let n = processes.length, completed = 0, time = 0;
  let done = new Array(n).fill(false);
  
  while (completed < n) {
    let idx = -1, minBurst = Infinity;
    for (let i = 0; i < n; i++) {
      // Find ready processes and choose the one with shortest burst
      if (processes[i].arrival <= time && !done[i] && processes[i].burst < minBurst) {
        minBurst = processes[i].burst;
        idx = i;
      }
    }
    if (idx === -1) {
      time++; // CPU remains idle
    } else {
      processes[idx].startTime = time;
      processes[idx].endTime = time + processes[idx].burst;
      processes[idx].tat = processes[idx].endTime - processes[idx].arrival;
      processes[idx].wt = processes[idx].startTime - processes[idx].arrival;
      done[idx] = true;
      completed++;
      time = processes[idx].endTime;
    }
  }
  return processes;
}`,
  python: `# ===== SJF SCHEDULING (Non-Preemptive) =====
def sjf_scheduling(processes):
    n = len(processes)
    completed = 0
    time = 0
    done = [False] * n
    
    while completed < n:
        idx = -1
        min_burst = float('inf')
        for i in range(n):
            if processes[i]['arrival'] <= time and not done[i] and processes[i]['burst'] < min_burst:
                min_burst = processes[i]['burst']
                idx = i
        if idx == -1:
            time += 1
        else:
            processes[idx]['start_time'] = time
            processes[idx]['end_time'] = time + processes[idx]['burst']
            processes[idx]['tat'] = processes[idx]['end_time'] - processes[idx]['arrival']
            processes[idx]['wt'] = processes[idx]['start_time'] - processes[idx]['arrival']
            done[idx] = True
            completed += 1
            time = processes[idx]['end_time']
    return processes`,
  java: `// ===== SJF SCHEDULING (Non-Preemptive) =====
import java.util.*;

class Process {
    String pid;
    int arrival, burst, startTime, endTime, wt, tat;
    boolean isDone = false;
    Process(String pid, int arrival, int burst) {
        this.pid = pid; this.arrival = arrival; this.burst = burst;
    }
}

public class SJFScheduling {
    public static void schedule(List<Process> processes) {
        int n = processes.size(), completed = 0, time = 0;
        while (completed < n) {
            int idx = -1, minBurst = Integer.MAX_VALUE;
            for (int i = 0; i < n; i++) {
                Process p = processes.get(i);
                if (p.arrival <= time && !p.isDone && p.burst < minBurst) {
                    minBurst = p.burst;
                    idx = i;
                }
            }
            if (idx == -1) {
                time++;
            } else {
                Process p = processes.get(idx);
                p.startTime = time;
                p.endTime = time + p.burst;
                p.tat = p.endTime - p.arrival;
                p.wt = p.startTime - p.arrival;
                p.isDone = true;
                completed++;
                time = p.endTime;
            }
        }
    }
}`,
  cpp: `// ===== SJF SCHEDULING (Non-Preemptive) =====
#include <iostream>
#include <vector>
#include <climits>

struct Process {
    std::string pid;
    int arrival, burst, startTime, endTime, wt, tat;
    bool isDone = false;
};

void sjfScheduling(std::vector<Process>& processes) {
    int n = processes.size(), completed = 0, time = 0;
    while (completed < n) {
        int idx = -1, minBurst = INT_MAX;
        for (int i = 0; i < n; i++) {
            if (processes[i].arrival <= time && !processes[i].isDone && processes[i].burst < minBurst) {
                minBurst = processes[i].burst;
                idx = i;
            }
        }
        if (idx == -1) {
            time++;
        } else {
            processes[idx].startTime = time;
            processes[idx].endTime = time + processes[idx].burst;
            processes[idx].tat = processes[idx].endTime - processes[idx].arrival;
            processes[idx].wt = processes[idx].startTime - processes[idx].arrival;
            processes[idx].isDone = true;
            completed++;
            time = processes[idx].endTime;
        }
    }
}`,
  c: `// ===== SJF SCHEDULING (Non-Preemptive) =====
#include <stdio.h>
#include <stdbool.h>
#include <limits.h>

typedef struct {
    char pid[10];
    int arrival, burst, startTime, endTime, wt, tat;
    bool isDone;
} Process;

void sjfScheduling(Process arr[], int n) {
    int completed = 0, time = 0;
    for (int i = 0; i < n; i++) arr[i].isDone = false;
    
    while (completed < n) {
        int idx = -1, minBurst = INT_MAX;
        for (int i = 0; i < n; i++) {
            if (arr[i].arrival <= time && !arr[i].isDone && arr[i].burst < minBurst) {
                minBurst = arr[i].burst;
                idx = i;
            }
        }
        if (idx == -1) {
            time++;
        } else {
            arr[idx].startTime = time;
            arr[idx].endTime = time + arr[idx].burst;
            arr[idx].tat = arr[idx].endTime - arr[idx].arrival;
            arr[idx].wt = arr[idx].startTime - arr[idx].arrival;
            arr[idx].isDone = true;
            completed++;
            time = arr[idx].endTime;
        }
    }
}`,
  csharp: `// ===== SJF SCHEDULING (Non-Preemptive) =====
using System;
using System.Collections.Generic;

public class Process {
    public string Pid;
    public int Arrival, Burst, StartTime, EndTime, WT, TAT;
    public bool IsDone = false;
}

public class SJFScheduling {
    public static void Schedule(List<Process> processes) {
        int n = processes.Count, completed = 0, time = 0;
        while (completed < n) {
            int idx = -1, minBurst = int.MaxValue;
            for (int i = 0; i < n; i++) {
                if (processes[i].Arrival <= time && !processes[i].IsDone && processes[i].Burst < minBurst) {
                    minBurst = processes[i].Burst;
                    idx = i;
                }
            }
            if (idx == -1) {
                time++;
            } else {
                var p = processes[idx];
                p.StartTime = time;
                p.EndTime = time + p.Burst;
                p.TAT = p.EndTime - p.Arrival;
                p.WT = p.StartTime - p.Arrival;
                p.IsDone = true;
                completed++;
                time = p.EndTime;
            }
        }
    }
}`,
  go: `// ===== SJF SCHEDULING (Non-Preemptive) =====
package main

import "math"

type Process struct {
	Pid string
	Arrival, Burst, StartTime, EndTime, WT, TAT int
	IsDone bool
}

func SJFScheduling(processes []Process) {
	n := len(processes)
	completed := 0
	time := 0
	while completed < n {
		idx := -1
		minBurst := math.MaxInt32
		for i := 0; i < n; i++ {
			p := &processes[i]
			if p.Arrival <= time && !p.IsDone && p.Burst < minBurst {
				minBurst = p.Burst
				idx = i
			}
		}
		if idx == -1 {
			time++
		} else {
			p := &processes[idx]
			p.StartTime = time
			p.EndTime = time + p.Burst
			p.TAT = p.EndTime - p.Arrival
			p.WT = p.StartTime - p.Arrival
			p.IsDone = true
			completed++
			time = p.EndTime
		}
	}
}`,
  rust: `// ===== SJF SCHEDULING (Non-Preemptive) =====
struct Process {
    pid: String,
    arrival: i32,
    burst: i32,
    start_time: i32,
    end_time: i32,
    wt: i32,
    tat: i32,
    is_done: bool,
}

fn sjf_scheduling(processes: &mut Vec<Process>) {
    let n = processes.len();
    let mut completed = 0;
    let mut time = 0;
    
    while completed < n {
        let mut idx = None;
        let mut min_burst = i32::MAX;
        for i in 0..n {
            let p = &processes[i];
            if p.arrival <= time && !p.is_done && p.burst < min_burst {
                min_burst = p.burst;
                idx = Some(i);
            }
        }
        match idx {
            None => time += 1,
            Some(i) => {
                let p = &mut processes[i];
                p.start_time = time;
                p.end_time = time + p.burst;
                p.tat = p.end_time - p.arrival;
                p.wt = p.start_time - p.arrival;
                p.is_done = true;
                completed += 1;
                time = p.end_time;
            }
        }
    }
}`
};
