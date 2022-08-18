#! /usr/bin/env python

from subprocess import call, STDOUT, run, PIPE
import os
import functools
import re

def find_between(s, first, last ):
    try:
        start = s.index( first ) + len( first )
        end = s.index( last, start )
        return str(s[start:end]).strip()
    except ValueError:
        return ""

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'


root_dir = os.getcwd()
for root, dirs, files in os.walk("."):
    print(f"{bcolors.BOLD}{bcolors.HEADER}Repository - Branch - Info{bcolors.ENDC}")
    for dir_name in dirs:
        os.chdir(f"{dir_name}/")
        if call(["git", "branch"], stderr=STDOUT, stdout=open(os.devnull, 'w')) == 0:            
            output = run(["git", "status"], capture_output=True, text=True)
            split = output.stdout.split("\n")
            untracked_raw = find_between(output.stdout, "Untracked files:", "\n\n")
            untracked = re.sub('\(.*?\)', '', untracked_raw).strip()
            
            modified_raw = find_between(output.stdout, "Changes not staged for commit:", "\n\n")
            modified_raw2 = re.sub('\(.*?\)', '', modified_raw)
            modified = re.sub('modified:', '', modified_raw2).strip()
            
            data = f"{bcolors.OKBLUE}{dir_name}{bcolors.ENDC} - {split[0].split()[-1]} - "
            out_of_date = []
            if "nothing to commit" in output.stdout:
                data += f"{bcolors.OKGREEN}Updated{bcolors.ENDC}"
            if untracked:
                count_untracked = len(untracked.split("\n"))
                out_of_date.append(f"{bcolors.WARNING}{count_untracked} Untracked files{bcolors.ENDC}")
            if modified: 
                count_changes = len(modified.split("\n"))
                out_of_date.append(f"{bcolors.WARNING}{count_changes} modifications{bcolors.ENDC}") 
            
            if untracked or modified:
                data += f"{bcolors.WARNING}Out of Date - {bcolors.ENDC}" + " and ".join(out_of_date)

            print(data)
        os.chdir(root_dir)
    break