export const CODE_SNIPPETS = {
  javascript: `// ===== MULTILEVEL FEEDBACK QUEUE SCHEDULING =====
// Process starts in Q0 (Quantum = 4)
// If quantum expires, it is demoted to Q1 (Quantum = 8)
// If still not finished, demoted to Q2 (FCFS)
function mlfqScheduling(processes) {
  // Processes dynamically adapt and migrate queues
  // Lower queues are only executed if higher queues are completely empty
  // Promotes shorter jobs and responsive I/O tasks
}`,
  python: `# ===== MULTILEVEL FEEDBACK QUEUE SCHEDULING =====
def mlfq_scheduling(processes):
    # Multi-level adaptive feedback queues
    # Promotes/demotes processes according to CPU execution slice duration
    pass`,
  java: `// ===== MULTILEVEL FEEDBACK QUEUE SCHEDULING =====
import java.util.*;

public class MLFQScheduling {
    // Dynamically demotes processes down queues as execution time bursts accumulate
}`,
  cpp: `// ===== MULTILEVEL FEEDBACK QUEUE SCHEDULING =====
#include <iostream>
#include <vector>

void mlfqScheduling(std::vector<Process>& processes) {
    // Adaptive queue routing with ageing to prevent starvation
}`,
  c: `// ===== MULTILEVEL FEEDBACK QUEUE SCHEDULING =====
#include <stdio.h>

void mlfqScheduling(Process arr[], int n) {
    // Dynamic feedback levels supporting process-type classification
}`,
  csharp: `// ===== MULTILEVEL FEEDBACK QUEUE SCHEDULING =====
using System;

public class MLFQScheduling {
    public static void Schedule(List<Process> processes) {
        // Implements dynamic feedback queueing architecture
    }
}`,
  go: `// ===== MULTILEVEL FEEDBACK QUEUE SCHEDULING =====
package main

func MLFQScheduling(processes []Process) {
	// Aging and promotion logic to balance fairness and response time
}`,
  rust: `// ===== MULTILEVEL FEEDBACK QUEUE SCHEDULING =====
fn mlfq_scheduling(processes: &mut Vec<Process>) {
    // Adaptive multi-stage feedback scheduler
}`
};
