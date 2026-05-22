export const CODE_SNIPPETS = {
  javascript: `// ===== MULTILEVEL QUEUE SCHEDULING =====
// System Processes (Priority 1) -> Q0 (uses Round Robin)
// User Processes (Priority 2) -> Q1 (uses FCFS)
function mlqScheduling(processes, quantum = 2) {
  let q0 = [], q1 = [];
  // Distribute into respective static queues
  for (let p of processes) {
    p.remaining = p.burst;
    p.startTime = -1;
    if (p.priority === 1) q0.push(p);
    else q1.push(p);
  }
  
  // Q0 has absolute priority over Q1
  // Q0 executes with Round Robin (quantum=2)
  // Q1 executes with FCFS when Q0 is empty
  // (Full scheduling logic mimics multi-queue priority dispatching)
}`,
  python: `# ===== MULTILEVEL QUEUE SCHEDULING =====
def mlq_scheduling(processes, quantum=2):
    # Split into static priority queues
    q0 = [p for p in processes if p['priority'] == 1]
    q1 = [p for p in processes if p['priority'] >= 2]
    # Queue 0 (Interactive) has strict priority over Queue 1 (Batch)
    pass`,
  java: `// ===== MULTILEVEL QUEUE SCHEDULING =====
import java.util.*;

public class MLQScheduling {
    // Q0: High priority (Round Robin)
    // Q1: Low priority (FCFS)
    public static void schedule(List<Process> processes) {
        // Separate queues are served with static priority preemptive rules
    }
}`,
  cpp: `// ===== MULTILEVEL QUEUE SCHEDULING =====
#include <iostream>
#include <vector>

void mlqScheduling(std::vector<Process>& processes) {
    // Separate queues maintain independent schedulers (RR and FCFS)
}`,
  c: `// ===== MULTILEVEL QUEUE SCHEDULING =====
#include <stdio.h>

void mlqScheduling(Process arr[], int n) {
    // Static priority dispatch between system and user process groups
}`,
  csharp: `// ===== MULTILEVEL QUEUE SCHEDULING =====
using System;
using System.Collections.Generic;

public class MLQScheduling {
    public static void Schedule(List<Process> processes) {
        // High-level queues run scheduler depending on system priority bounds
    }
}`,
  go: `// ===== MULTILEVEL QUEUE SCHEDULING =====
package main

func MLQScheduling(processes []Process) {
	// Independent queues served preemptively based on priority level
}`,
  rust: `// ===== MULTILEVEL QUEUE SCHEDULING =====
fn mlq_scheduling(processes: &mut Vec<Process>) {
    // Processes are assigned permanent queues according to priority class
}`
};
