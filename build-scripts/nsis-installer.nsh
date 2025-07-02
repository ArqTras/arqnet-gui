!macro customInstall
    nsExec::Exec '"sc.exe" failure arqnet reset= 60 actions= restart/5000'
!macroend