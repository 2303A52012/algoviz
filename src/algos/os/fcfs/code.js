export const CODE_SNIPPETS = {
  javascript: `// ===== FCFS CPU SCHEDULING =====
function fcfsScheduling(processes) {
  // Sort processes by arrival time
  processes.sort((a, b) => a.arrival - b.arrival);
  
  let time = 0;
  for (let p of processes) {
    if (time < p.arrival) {
      time = p.arrival; // CPU remains idle until process arrives
    }
    p.startTime = time;
    p.endTime = time + p.burst;
    p.tat = p.endTime - p.arrival; // Turnaround Time = Completion - Arrival
    p.wt = p.startTime - p.arrival; // Waiting Time = Start - Arrival
    time = p.endTime;
  }
  return processes;
}`,
  python: `# ===== FCFS CPU SCHEDULING =====
def fcfs_scheduling(processes):
    # Sort processes by arrival time
    processes.sort(key=lambda p: p['arrival'])
    
    time = 0
    for p in processes:
        if time < p['arrival']:
            time = p['arrival']
        p['start_time'] = time
        p['end_time'] = time + p['burst']
        p['tat'] = p['end_time'] - p['arrival']
        p['wt'] = p['start_time'] - p['arrival']
        time = p['end_time']
    return processes`,
  java: `// ===== FCFS CPU SCHEDULING =====
import java.util.*;

class Process {
    String pid;
    int arrival, burst, startTime, endTime, wt, tat;
    Process(String pid, int arrival, int burst) {
        this.pid = pid; this.arrival = arrival; this.burst = burst;
    }
}

public class FCFSScheduling {
    public static void schedule(List<Process> processes) {
        processes.sort(Comparator.comparingInt(p -> p.arrival));
        int time = 0;
        for (Process p : processes) {
            if (time < p.arrival) {
                time = p.arrival;
            }
            p.startTime = time;
            p.endTime = time + p.burst;
            p.tat = p.endTime - p.arrival;
            p.wt = p.startTime - p.arrival;
            time = p.endTime;
        }
    }
}`,
  cpp: `// ===== FCFS CPU SCHEDULING =====
#include <iostream>
#include <vector>
#include <algorithm>

struct Process {
    std::string pid;
    int arrival, burst, startTime, endTime, wt, tat;
};

void fcfsScheduling(std::vector<Process>& processes) {
    std::sort(processes.begin(), processes.end(), [](const Process& a, const Process& b) {
        return a.arrival < b.arrival;
    });
    
    int time = 0;
    for (auto& p : processes) {
        if (time < p.arrival) {
            time = p.arrival;
        }
        p.startTime = time;
        p.endTime = time + p.burst;
        p.tat = p.endTime - p.arrival;
        p.wt = p.startTime - p.arrival;
        time = p.endTime;
    }
}`,
  c: `// ===== FCFS CPU SCHEDULING =====
#include <stdio.h>
#include <stdlib.h>

typedef struct {
    char pid[10];
    int arrival, burst, startTime, endTime, wt, tat;
} Process;

int compareArrival(const void* a, const void* b) {
    return ((Process*)a)->arrival - ((Process*)b)->arrival;
}

void fcfsScheduling(Process arr[], int n) {
    qsort(arr, n, sizeof(Process), compareArrival);
    int time = 0;
    for (int i = 0; i < n; i++) {
        if (time < arr[i].arrival) {
            time = arr[i].arrival;
        }
        arr[i].startTime = time;
        arr[i].endTime = time + arr[i].burst;
        arr[i].tat = arr[i].endTime - arr[i].arrival;
        arr[i].wt = arr[i].startTime - arr[i].arrival;
        time = arr[i].endTime;
    }
}`,
  csharp: `// ===== FCFS CPU SCHEDULING =====
using System;
using System.Collections.Generic;
using System.Linq;

public class Process {
    public string Pid;
    public int Arrival, Burst, StartTime, EndTime, WT, TAT;
}

public class FCFSScheduling {
    public static void Schedule(List<Process> processes) {
        var sorted = processes.OrderBy(p => p.Arrival).ToList();
        int time = 0;
        foreach (var p in sorted) {
            if (time < p.Arrival) {
                time = p.Arrival;
            }
            p.StartTime = time;
            p.EndTime = time + p.Burst;
            p.TAT = p.EndTime - p.Arrival;
            p.WT = p.StartTime - p.Arrival;
            time = p.EndTime;
        }
    }
}`,
  go: `// ===== FCFS CPU SCHEDULING =====
package main

import "sort"

type Process struct {
	Pid string
	Arrival, Burst, StartTime, EndTime, WT, TAT int
}

func FCFSScheduling(processes []Process) {
	sort.Slice(processes, func(i, j int) bool {
		return processes[i].Arrival < processes[j].Arrival
	})
	time := 0
	for i := range processes {
		p := &processes[i]
		if time < p.Arrival {
			time = p.Arrival
		}
		p.StartTime = time
		p.EndTime = time + p.Burst
		p.TAT = p.EndTime - p.Arrival
		p.WT = p.StartTime - p.Arrival
		time = p.EndTime
	}
}`,
  rust: `// ===== FCFS CPU SCHEDULING =====
#[derive(Debug, Clone)]
struct Process {
    pid: String,
    arrival: i32,
    burst: i32,
    start_time: i32,
    end_time: i32,
    wt: i32,
    tat: i32,
}

fn fcfs_scheduling(processes: &mut Vec<Process>) {
    processes.sort_by_key(|p| p.arrival);
    let mut time = 0;
    for p in processes.iter_mut() {
        if time < p.arrival {
            time = p.arrival;
        }
        p.start_time = time;
        p.end_time = time + p.burst;
        p.tat = p.end_time - p.arrival;
        p.wt = p.start_time - p.arrival;
        time = p.end_time;
    }
}`
};
