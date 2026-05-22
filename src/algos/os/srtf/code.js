export const CODE_SNIPPETS = {
  javascript: `// ===== SRTF CPU SCHEDULING (Preemptive SJF) =====
function srtfScheduling(processes) {
  let n = processes.length, completed = 0, time = 0;
  let remaining = processes.map(p => p.burst);
  let done = new Array(n).fill(false);
  
  while (completed < n) {
    let idx = -1, minRemaining = Infinity;
    for (let i = 0; i < n; i++) {
      if (processes[i].arrival <= time && !done[i] && remaining[i] < minRemaining) {
        minRemaining = remaining[i];
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
  python: `# ===== SRTF CPU SCHEDULING (Preemptive SJF) =====
def srtf_scheduling(processes):
    n = len(processes)
    completed = 0
    time = 0
    remaining = [p['burst'] for p in processes]
    done = [False] * n
    
    while completed < n:
        idx = -1
        min_rem = float('inf')
        for i in range(n):
            if processes[i]['arrival'] <= time and not done[i] and remaining[i] < min_rem:
                min_rem = remaining[i]
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
  java: `// ===== SRTF CPU SCHEDULING (Preemptive SJF) =====
import java.util.*;

class Process {
    String pid;
    int arrival, burst, startTime = -1, endTime, wt, tat, remaining;
    boolean isDone = false;
    Process(String pid, int arrival, int burst) {
        this.pid = pid; this.arrival = arrival; this.burst = burst; this.remaining = burst;
    }
}

public class SRTFScheduling {
    public static void schedule(List<Process> processes) {
        int n = processes.size(), completed = 0, time = 0;
        while (completed < n) {
            int idx = -1, minRemaining = Integer.MAX_VALUE;
            for (int i = 0; i < n; i++) {
                Process p = processes.get(i);
                if (p.arrival <= time && !p.isDone && p.remaining < minRemaining) {
                    minRemaining = p.remaining;
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
  cpp: `// ===== SRTF CPU SCHEDULING (Preemptive SJF) =====
#include <iostream>
#include <vector>
#include <climits>

struct Process {
    std::string pid;
    int arrival, burst, startTime = -1, endTime, wt, tat, remaining;
    bool isDone = false;
};

void srtfScheduling(std::vector<Process>& processes) {
    int n = processes.size(), completed = 0, time = 0;
    for (auto& p : processes) p.remaining = p.burst;
    
    while (completed < n) {
        int idx = -1, minRemaining = INT_MAX;
        for (int i = 0; i < n; i++) {
            if (processes[i].arrival <= time && !processes[i].isDone && processes[i].remaining < minRemaining) {
                minRemaining = processes[i].remaining;
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
  c: `// ===== SRTF CPU SCHEDULING (Preemptive SJF) =====
#include <stdio.h>
#include <stdbool.h>
#include <limits.h>

typedef struct {
    char pid[10];
    int arrival, burst, startTime, endTime, wt, tat, remaining;
    bool isDone;
} Process;

void srtfScheduling(Process arr[], int n) {
    int completed = 0, time = 0;
    for (int i = 0; i < n; i++) {
        arr[i].remaining = arr[i].burst;
        arr[i].startTime = -1;
        arr[i].isDone = false;
    }
    
    while (completed < n) {
        int idx = -1, minRemaining = INT_MAX;
        for (int i = 0; i < n; i++) {
            if (arr[i].arrival <= time && !arr[i].isDone && arr[i].remaining < minRemaining) {
                minRemaining = arr[i].remaining;
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
  csharp: `// ===== SRTF CPU SCHEDULING (Preemptive SJF) =====
using System;
using System.Collections.Generic;

public class Process {
    public string Pid;
    public int Arrival, Burst, StartTime = -1, EndTime, WT, TAT, Remaining;
    public bool IsDone = false;
}

public class SRTFScheduling {
    public static void Schedule(List<Process> processes) {
        int n = processes.Count, completed = 0, time = 0;
        foreach (var p in processes) p.Remaining = p.Burst;
        
        while (completed < n) {
            int idx = -1, minRemaining = int.MaxValue;
            for (int i = 0; i < n; i++) {
                if (processes[i].Arrival <= time && !processes[i].IsDone && processes[i].Remaining < minRemaining) {
                    minRemaining = processes[i].Remaining;
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
  go: `// ===== SRTF CPU SCHEDULING (Preemptive SJF) =====
package main

import "math"

type Process struct {
	Pid string
	Arrival, Burst, StartTime, EndTime, WT, TAT, Remaining int
	IsDone bool
}

func SRTFScheduling(processes []Process) {
	n := len(processes)
	for i := range processes {
		processes[i].Remaining = processes[i].Burst
		processes[i].StartTime = -1
	}
	completed, time := 0, 0
	for completed < n {
		idx := -1
		minRemaining := math.MaxInt32
		for i := 0; i < n; i++ {
			p := &processes[i]
			if p.Arrival <= time && !p.IsDone && p.Remaining < minRemaining {
				minRemaining = p.Remaining
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
  rust: `// ===== SRTF CPU SCHEDULING (Preemptive SJF) =====
struct Process {
    pid: String,
    arrival: i32,
    burst: i32,
    start_time: i32,
    end_time: i32,
    wt: i32,
    tat: i32,
    remaining: i32,
    is_done: bool,
}

fn srtf_scheduling(processes: &mut Vec<Process>) {
    let n = processes.len();
    for p in processes.iter_mut() {
        p.remaining = p.burst;
        p.start_time = -1;
    }
    let mut completed = 0;
    let mut time = 0;
    
    while completed < n {
        let mut idx = None;
        let mut min_remaining = i32::MAX;
        for i in 0..n {
            let p = &processes[i];
            if p.arrival <= time && !p.is_done && p.remaining < min_remaining {
                min_remaining = p.remaining;
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
