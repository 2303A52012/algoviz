export const CODE_SNIPPETS = {
  javascript: `// ===== FCFS DISK SCHEDULING =====
function fcfsDisk(requests, initial) {
  let seq = [initial, ...requests];
  let totalSeek = 0;
  
  for (let i = 0; i < seq.length - 1; i++) {
    totalSeek += Math.abs(seq[i+1] - seq[i]);
  }
  return { sequence: seq, totalSeek };
}`,
  python: `# ===== FCFS DISK SCHEDULING =====
def fcfs_disk(requests, initial):
    seq = [initial] + requests
    total_seek = 0
    for i in range(len(seq) - 1):
        total_seek += abs(seq[i+1] - seq[i])
    return seq, total_seek`,
  java: `// ===== FCFS DISK SCHEDULING =====
import java.util.*;

public class FCFSDisk {
    public static int schedule(int[] requests, int initial, List<Integer> sequence) {
        sequence.add(initial);
        int totalSeek = 0, current = initial;
        for (int req : requests) {
            sequence.add(req);
            totalSeek += Math.abs(req - current);
            current = req;
        }
        return totalSeek;
    }
}`,
  cpp: `// ===== FCFS DISK SCHEDULING =====
#include <iostream>
#include <vector>
#include <cmath>

int fcfsDisk(const std::vector<int>& requests, int initial, std::vector<int>& sequence) {
    sequence.push_back(initial);
    int totalSeek = 0, current = initial;
    for (int req : requests) {
        sequence.push_back(req);
        totalSeek += std::abs(req - current);
        current = req;
    }
    return totalSeek;
}`,
  c: `// ===== FCFS DISK SCHEDULING =====
#include <stdio.h>
#include <stdlib.h>

int fcfsDisk(int requests[], int numReqs, int initial, int sequence[]) {
    sequence[0] = initial;
    int totalSeek = 0, current = initial;
    for (int i = 0; i < numReqs; i++) {
        sequence[i+1] = requests[i];
        totalSeek += abs(requests[i] - current);
        current = requests[i];
    }
    return totalSeek;
}`,
  csharp: `// ===== FCFS DISK SCHEDULING =====
using System;
using System.Collections.Generic;

public class FCFSDisk {
    public static int Schedule(List<int> requests, int initial, out List<int> sequence) {
        sequence = new List<int> { initial };
        int totalSeek = 0, current = initial;
        foreach (int req in requests) {
            sequence.Add(req);
            totalSeek += Math.Abs(req - current);
            current = req;
        }
        return totalSeek;
    }
}`,
  go: `// ===== FCFS DISK SCHEDULING =====
package main

import "math"

func FCFSDisk(requests []int, initial int) ([]int, int) {
	seq := append([]int{initial}, requests...)
	totalSeek := 0
	for i := 0; i < len(seq)-1; i++ {
		totalSeek += int(math.Abs(float64(seq[i+1] - seq[i])))
	}
	return seq, totalSeek
}`,
  rust: `// ===== FCFS DISK SCHEDULING =====
fn fcfs_disk(requests: &[i32], initial: i32) -> (Vec<i32>, i32) {
    let mut seq = vec![initial];
    seq.extend_from_slice(requests);
    let mut total_seek = 0;
    for i in 0..seq.len() - 1 {
        total_seek += (seq[i+1] - seq[i]).abs();
    }
    (seq, total_seek)
}`
};
