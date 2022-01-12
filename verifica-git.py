#! /usr/bin/env python

from subprocess import call, STDOUT, run, PIPE
import os
import functools


root_dir = os.getcwd()
for root, dirs, files in os.walk("."):
    for dir_name in dirs:
        os.chdir(f"{dir_name}/")
        if call(["git", "branch"], stderr=STDOUT, stdout=open(os.devnull, 'w')) == 0:            
            output = run(["git", "status"], capture_output=True, text=True)
            split = output.stdout.split("\n")
            print(f"Repositório: {dir_name}")
            print("Branch: ", split[0].split()[-1])
            if split[1].startswith("Your branch is up to date"):
                print("Atualizado")
            elif split[2].startswith("No commits yet"):
                print("Sem nenhum commit")
            else: 
                count_changes = functools.reduce(lambda a,b: a + 1 if "modified" in b else a, split, 0)
                print(f"Desatualizado - {count_changes} modificações")
            print("\n")
        os.chdir(root_dir)
    break