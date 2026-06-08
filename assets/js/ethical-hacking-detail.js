const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const modules = [
  {
    title: "Enumeration & Reconnaissance Foundations",
    focus: "Authorized target discovery",
    lessons: [
      "Ethical rules and lab boundaries", "Lab network validation", "Target identification",
      "Port and service discovery", "Service version analysis", "Web service enumeration",
      "Directory and content discovery", "SMB/FTP/SSH basic enumeration",
      "Notes and evidence collection", "Enumeration checklist"
    ],
    profiles: {
      beginner: {
        time: "3 hours",
        objectives: ["Explain authorization and scope", "Identify one learner-owned lab target", "Understand ports and services", "Keep a simple evidence notebook"],
        explanation: [
          "Enumeration means carefully collecting facts about a system you are allowed to assess. Before any command, confirm that the target is your own VM, an intentionally vulnerable local machine, a CTF box, or a written-permission system.",
          "Start with network validation, then identify the target address from its own console. A port is a numbered network endpoint; a service is the program responding there. Results describe what was observed, not whether a system is vulnerable."
        ],
        steps: ["Create a notes directory.", "Record the authorized target and lab network.", "Confirm Kali's own address and route.", "Test connectivity to one authorized lab IP.", "Run a basic scan against that exact IP.", "Save observations in the module notes."],
        commands: `mkdir -p ~/digitalmizzle-ethical-hacking/notes\nnano ~/digitalmizzle-ethical-hacking/notes/enumeration.md\nip a\nip route\nhostname -I\nping -c 4 LAB_TARGET_IP\nnmap LAB_TARGET_IP\ncurl -I http://LAB_TARGET_IP`,
        expected: "The network commands show your Kali VM interfaces and route. Ping may confirm reachability if the lab target allows it. Nmap lists responding ports on the single authorized VM. Curl displays web headers only when the local target runs HTTP.",
        troubleshooting: ["No ping response does not prove the VM is offline; verify the address from its console.", "Connection refused usually means no service is listening on that port.", "If the IP is outside the documented lab subnet, stop and recheck scope."],
        mistakes: ["Guessing target addresses", "Scanning an entire network", "Calling every open port a vulnerability", "Forgetting to record the exact command"],
        takeaway: "Enumeration is a bounded evidence-gathering process: verify scope, collect facts, and avoid conclusions unsupported by the results.",
        quiz: [["What must be confirmed before enumeration?", ["Authorization and scope", "A public IP", "Stealth settings"], 0], ["What is an open port?", ["A responding network endpoint", "Proof of compromise", "A password"], 0], ["Where should LAB_TARGET_IP come from?", ["The owned target VM or approved scope", "A random website", "An internet search"], 0]]
      },
      intermediate: {
        time: "3.5 hours",
        objectives: ["Build a repeatable enumeration sequence", "Compare host discovery and service detection", "Validate web, SMB, FTP, and SSH exposure safely", "Capture timestamped evidence"],
        explanation: [
          "Intermediate enumeration follows a hypothesis-driven workflow: validate the target, identify exposed services, inspect versions cautiously, then select protocol-specific checks that do not alter the target.",
          "Service fingerprints are estimates. Correlate scan output with banners, HTTP headers, and configuration evidence from the owned VM. Document confidence and avoid expanding scope when results are incomplete."
        ],
        steps: ["Create a timestamped evidence directory.", "Record interface, route, target, and authorization reference.", "Run service detection on one authorized IP.", "Inspect local-lab HTTP headers when present.", "Review SMB shares without credentials only if the lab is designed for it.", "Hash and annotate the collected output."],
        commands: `work=~/digitalmizzle-ethical-hacking/evidence/enumeration-$(date +%Y%m%d)\nmkdir -p "$work"\nip -brief address | tee "$work/kali-interfaces.txt"\nip route | tee "$work/kali-routes.txt"\nnmap -sV -oN "$work/services.txt" LAB_TARGET_IP\ncurl --fail --show-error -I http://LAB_TARGET_IP | tee "$work/http-headers.txt"\nsmbclient -L //LAB_TARGET_IP -N 2>&1 | tee "$work/smb-summary.txt"\nsha256sum "$work"/*.txt | tee "$work/SHA256SUMS"`,
        expected: "The evidence folder contains Kali network context, Nmap service guesses, optional local web headers, and an SMB summary for the deliberately vulnerable target. Failed protocol checks are valid observations and should remain documented.",
        troubleshooting: ["Service detection is slow: confirm you are scanning one IP only.", "SMB command unavailable: install `smbclient` from trusted Kali repositories.", "HTTP command fails: verify that Nmap actually reported a web service and use its lab port."],
        mistakes: ["Running every protocol tool regardless of discovered services", "Removing failed checks from notes", "Treating anonymous access as acceptable outside a designed lab"],
        takeaway: "A strong enumeration record links each protocol check to prior evidence and preserves both positive and negative results.",
        quiz: [["Why use `-sV`?", ["To estimate service versions", "To exploit services", "To hide activity"], 0], ["Why keep failed checks?", ["They document what was tested", "They contain passwords", "They increase access"], 0], ["What should drive protocol-specific checks?", ["Observed authorized services", "Curiosity about public systems", "A random checklist"], 0]]
      },
      advanced: {
        time: "4 hours",
        objectives: ["Plan an auditable enumeration methodology", "Capture machine-readable and analyst-readable results", "Correlate multiple evidence sources", "Document confidence, assumptions, and limitations"],
        explanation: [
          "Advanced enumeration is an asset-scoped technical audit. The methodology defines the objective, target, time window, allowed protocols, output formats, and stopping conditions before collection begins.",
          "Professional interpretation separates observation, corroboration, inference, and risk. Tool fingerprints require validation, and sparse results never justify silently widening the approved target set."
        ],
        steps: ["Write a scope and methodology note for one local target.", "Capture Kali route and timestamp context.", "Run bounded service detection with normal and XML output.", "Collect headers only from identified local web services.", "Create an evidence manifest and analyst summary.", "Record limitations and untested areas."],
        commands: `work=~/digitalmizzle-ethical-hacking/audit/enumeration-$(date +%Y%m%d-%H%M%S)\ninstall -d -m 700 "$work"\nprintf 'Target: LAB_TARGET_IP\\nAuthorization: learner-owned local VM\\nScope: one host only\\n' > "$work/scope.txt"\ndate --iso-8601=seconds | tee "$work/timestamp.txt"\nip route get LAB_TARGET_IP | tee "$work/route-validation.txt"\nnmap -sV -oA "$work/authorized-services" LAB_TARGET_IP\ncurl --fail --show-error --dump-header "$work/http-headers.txt" --output /dev/null http://LAB_TARGET_IP\nsha256sum "$work"/* | tee "$work/SHA256SUMS"`,
        expected: "The restricted directory contains scope, time, route validation, Nmap normal/XML/grepable outputs, optional HTTP headers, and integrity hashes. Analysts should note fingerprint confidence and any commands that returned no result.",
        troubleshooting: ["Route does not use the lab adapter: stop and correct isolation.", "XML output is empty: review the Nmap normal report and command status.", "Header capture fails: validate the reported protocol and port rather than trying unrelated targets."],
        mistakes: ["Collecting more data than the objective requires", "Presenting fingerprints as verified software inventory", "Omitting negative findings and limitations", "Widening scope because one host is quiet"],
        takeaway: "Professional enumeration is reproducible, evidence-led, minimally scoped, and explicit about uncertainty.",
        quiz: [["What does `-oA` produce?", ["Multiple output formats", "An exploit", "Anonymous access"], 0], ["What should happen if the route uses the wrong adapter?", ["Stop and correct isolation", "Continue quietly", "Scan a different host"], 0], ["How should fingerprints be reported?", ["With confidence and validation status", "As unquestionable facts", "Without evidence"], 0]]
      }
    }
  },
  {
    title: "Exploitation in Controlled Labs",
    focus: "Vulnerability validation concepts",
    lessons: [
      "What exploitation means ethically", "Reading vulnerability descriptions",
      "Matching services to known lab vulnerabilities", "Using Metasploit safely in local labs",
      "Manual verification basics", "Web login testing concepts", "File upload vulnerability concepts",
      "Command injection lab concept", "Reverse shell theory in labs only",
      "Post-exploitation boundaries", "Evidence capture during exploitation"
    ],
    profiles: {
      beginner: {
        time: "3.5 hours",
        objectives: ["Define exploitation in an ethical lab", "Read vulnerability descriptions without rushing to action", "Understand proof versus impact", "Recognize strict post-access boundaries"],
        explanation: [
          "Exploitation is controlled validation that a known weakness can affect an authorized lab target. This module focuses on concepts, decision-making, and evidence rather than attack payloads.",
          "Read a vulnerability description for affected product, version, prerequisites, impact, and remediation. A matching version is only a lead; it is not proof that the lab system is vulnerable."
        ],
        steps: ["Choose an intentionally vulnerable local VM.", "Record its discovered service and version.", "Read the lab's official exercise description.", "Compare prerequisites with your evidence.", "Open Metasploit only to study its help and module information interface.", "Document what would be in scope and what is prohibited."],
        commands: `mkdir -p ~/digitalmizzle-ethical-hacking/notes\nprintf '# Controlled Validation Notes\\n\\nTarget: LAB_TARGET_IP\\nAuthorization: learner-owned lab\\n' > ~/digitalmizzle-ethical-hacking/notes/validation.md\nnmap -sV LAB_TARGET_IP\nmsfconsole -q\nhelp\nsearch type:auxiliary name:http\nexit`,
        expected: "The notes establish scope, Nmap provides a service lead, and Metasploit displays its console help and a list of informational or auxiliary matches. No exploit module is launched and no session is created.",
        troubleshooting: ["Metasploit starts slowly on first use; keep the target untouched while it initializes.", "No matching result is normal and does not justify searching unrelated systems.", "If the lab guide and observed version disagree, document the mismatch."],
        mistakes: ["Assuming a version match proves exploitability", "Copying exploit commands from random sources", "Continuing after unexpected access", "Testing real login accounts"],
        takeaway: "Ethical exploitation is authorized, minimal, evidence-driven validation with clear stopping conditions.",
        quiz: [["Does a matching version prove vulnerability?", ["No", "Always", "Only on Linux"], 0], ["What is this Metasploit exercise for?", ["Learning help and module information", "Launching attacks", "Creating persistence"], 0], ["What should happen after unexpected access?", ["Stop and document", "Explore everything", "Hide activity"], 0]]
      },
      intermediate: {
        time: "4 hours",
        objectives: ["Map prerequisites to lab evidence", "Use controlled non-destructive verification", "Understand web weakness categories", "Preserve validation evidence and boundaries"],
        explanation: [
          "Intermediate validation builds a test case before execution: claim, prerequisites, safe observation, expected result, stop condition, and cleanup. This prevents tool-driven testing.",
          "Login, upload, command injection, and reverse-shell concepts are studied through intentionally vulnerable training applications. Credentials, payloads, persistence, and third-party targets are outside this preview."
        ],
        steps: ["Create a validation worksheet.", "Capture the lab service and HTTP response.", "Record the vulnerability claim and prerequisites from the official lab guide.", "Use Metasploit `info` only on a lab module selected by the instructor.", "Define what evidence would support or reject the claim.", "Record cleanup and stop conditions."],
        commands: `work=~/digitalmizzle-ethical-hacking/evidence/validation\nmkdir -p "$work"\nnmap -sV -oN "$work/services.txt" LAB_TARGET_IP\ncurl --fail --show-error -I http://LAB_TARGET_IP | tee "$work/http-headers.txt"\nprintf 'Claim:\\nPrerequisites:\\nSafe test:\\nExpected result:\\nStop condition:\\nCleanup:\\n' > "$work/test-case.md"\nmsfconsole -q\nhelp info\nhelp search\nexit\nsha256sum "$work"/* | tee "$work/SHA256SUMS"`,
        expected: "The worksheet and evidence define a controlled validation plan. Metasploit help explains how analysts inspect modules, but the exercise does not configure or execute an exploit.",
        troubleshooting: ["Observed service differs from the lab guide: stop and verify snapshot/version.", "HTTP is redirected: record the status and approved local destination.", "A prerequisite cannot be confirmed: mark the test inconclusive."],
        mistakes: ["Changing multiple variables during a test", "Calling an inconclusive test secure or vulnerable", "Collecting data after the stop condition", "Using real credentials"],
        takeaway: "A defensible validation test can be reviewed before it runs and interpreted even when the result is negative.",
        quiz: [["What makes a test case reviewable?", ["Claim, prerequisites, expected result, and stop condition", "A tool name only", "A public target"], 0], ["How should missing prerequisites be handled?", ["Mark the test inconclusive", "Assume they exist", "Expand scope"], 0], ["What does this module avoid?", ["Payload and persistence instructions", "Documentation", "Local evidence"], 0]]
      },
      advanced: {
        time: "4.5 hours",
        objectives: ["Design risk-bounded validation methodology", "Distinguish exposure, weakness, exploitability, and impact", "Apply evidence quality and stopping logic", "Write a professional validation record"],
        explanation: [
          "Advanced practitioners distinguish exposed service, suspected weakness, confirmed vulnerable condition, demonstrated impact, and residual risk. Each level requires different evidence.",
          "Validation plans should be peer-reviewable, reversible, and proportionate. In this preview, technical interaction remains non-destructive and local; exploit execution, shell delivery, evasion, and persistence are deliberately excluded."
        ],
        steps: ["Create scope and rules-of-engagement artifacts.", "Baseline the authorized service.", "Write a validation decision tree.", "Inspect official lab documentation and tool metadata.", "Capture evidence hashes and analyst conclusions.", "State what was not tested and why."],
        commands: `work=~/digitalmizzle-ethical-hacking/audit/controlled-validation\ninstall -d -m 700 "$work"\nprintf 'Target: LAB_TARGET_IP\\nAllowed: non-destructive local validation\\nProhibited: persistence, stealth, public targets\\n' > "$work/rules.txt"\nnmap -sV -oA "$work/service-baseline" LAB_TARGET_IP\ncurl --fail --show-error --dump-header "$work/headers.txt" --output /dev/null http://LAB_TARGET_IP\nprintf 'Observation:\\nClaim:\\nPrerequisite evidence:\\nValidation limit:\\nResult:\\nConfidence:\\nRemediation:\\n' > "$work/record.md"\nsha256sum "$work"/* | tee "$work/SHA256SUMS"`,
        expected: "The audit folder provides scope, service baseline, response metadata, a structured validation record, and integrity values. It supports a professional conclusion without executing an exploit.",
        troubleshooting: ["Conflicting evidence: preserve both sources and lower confidence.", "Unexpected state change: stop, restore the lab snapshot, and record the event.", "Tool output lacks context: corroborate from the owned target's configuration."],
        mistakes: ["Equating technical possibility with business impact", "Failing to define prohibited actions", "Reporting unvalidated scanner text as a confirmed finding", "Omitting limitations"],
        takeaway: "Expert validation proves only what is necessary, preserves system state, and communicates confidence and limitations.",
        quiz: [["What comes after a suspected weakness?", ["Prerequisite validation", "Automatic exploitation", "Public scanning"], 0], ["Why define prohibited actions?", ["To bound risk and behavior", "To hide activity", "To increase access"], 0], ["How should conflicting evidence affect reporting?", ["Lower confidence and preserve both sources", "Ignore one source", "Claim certainty"], 0]]
      }
    }
  },
  {
    title: "Privilege Escalation Basics",
    focus: "Privilege boundary awareness",
    lessons: [
      "What privilege escalation is", "Linux enumeration after lab access",
      "Checking users and groups", "Kernel and OS version checks", "SUID/SGID concept",
      "Writable path and permission issues", "Scheduled tasks and cron basics",
      "Misconfiguration awareness", "Windows privilege escalation concepts",
      "Safe privilege escalation checklist"
    ],
    profiles: {
      beginner: {
        time: "3 hours",
        objectives: ["Explain privilege levels", "Inspect identity and permissions on your own VM", "Recognize SUID and scheduled-task concepts", "Avoid changing system state"],
        explanation: [
          "Privilege escalation means moving from a lower-privilege account to a more powerful one because of a vulnerability or misconfiguration. In this preview, you learn how defenders inspect boundaries on a learner-owned VM.",
          "Users, groups, file permissions, special permission bits, and scheduled tasks can create risk when configured incorrectly. Observation comes first; do not change or execute unfamiliar system files."
        ],
        steps: ["Confirm the current user and groups.", "Record OS and kernel details.", "Inspect your home-directory permissions.", "List scheduled task configuration without editing it.", "Review a deliberately created practice permission issue in your lab folder."],
        commands: `mkdir -p ~/digitalmizzle-ethical-hacking/privilege-lab\nwhoami\nid\nuname -a\ncat /etc/os-release\nls -ld ~ ~/digitalmizzle-ethical-hacking\nls -l /etc/cron.d 2>/dev/null\nfind ~/digitalmizzle-ethical-hacking -perm -0002 -ls`,
        expected: "Identity, groups, OS, kernel, directory permissions, and scheduled-task filenames are displayed. The scoped `find` reports only world-writable items inside your own course directory, if any.",
        troubleshooting: ["Permission denied is expected for protected system areas.", "No `find` result means no matching item exists in the scoped practice folder.", "Do not add sudo merely to suppress a normal access restriction."],
        mistakes: ["Searching the whole system without purpose", "Changing permissions to see what happens", "Executing unknown SUID files", "Treating normal group membership as a vulnerability"],
        takeaway: "Privilege analysis begins with identity, intended access, and configuration context, not with blindly running escalation techniques.",
        quiz: [["What is privilege escalation?", ["Gaining greater privileges through a weakness or misconfiguration", "Opening a browser", "Changing a hostname"], 0], ["Where is the writable-file search scoped?", ["The learner's course folder", "The entire internet", "Other users' systems"], 0], ["Should you change unknown system permissions?", ["No", "Always", "Only quietly"], 0]]
      },
      intermediate: {
        time: "3.5 hours",
        objectives: ["Build a local privilege baseline", "Interpret users, groups, sudo policy, and special bits", "Review cron and writable-path risk", "Document intended versus observed access"],
        explanation: [
          "Intermediate privilege analysis compares observed permissions with intended function. A special bit or scheduled task is not automatically vulnerable; risk depends on ownership, writability, execution context, and trusted content.",
          "Use the learner-owned VM or a deliberately vulnerable training VM. Do not attempt kernel exploitation, password recovery, or unauthorized account access."
        ],
        steps: ["Create a restricted evidence folder.", "Capture identity and group membership.", "List permitted sudo commands without running them.", "Inspect a limited sample of special-bit files.", "Review cron configuration metadata.", "Search only the lab workspace for unsafe writability."],
        commands: `work=~/digitalmizzle-ethical-hacking/evidence/privilege\ninstall -d -m 700 "$work"\n{\n  id\n  uname -a\n  cat /etc/os-release\n  sudo -l\n  find /usr/bin -xdev \\( -perm -4000 -o -perm -2000 \\) -printf '%M %u:%g %p\\n' 2>/dev/null | head -n 30\n  stat -c '%A %a %U:%G %n' /etc/crontab /etc/cron.d 2>/dev/null\n  find ~/digitalmizzle-ethical-hacking -xdev -perm -0002 -printf '%M %u:%g %p\\n'\n} | tee "$work/baseline.txt"`,
        expected: "The baseline records identity, platform, allowed sudo policy, a bounded sample of special-bit executables, cron metadata, and writable objects in the learner's lab workspace.",
        troubleshooting: ["`sudo -l` asks for your own VM password; cancel if the lab does not permit it.", "A long special-bit list is inventory, not a finding.", "If expected vulnerable content is missing, verify the training snapshot."],
        mistakes: ["Assuming every SUID file is exploitable", "Running permitted sudo commands without a test objective", "Ignoring file ownership and writability", "Using automated escalation scripts without review"],
        takeaway: "Privilege findings require a complete path: controlled input, privileged execution, observable impact, and evidence.",
        quiz: [["Is every SUID file a vulnerability?", ["No", "Yes", "Only on Kali"], 0], ["What does `sudo -l` show?", ["Commands the current user may run through sudo", "Open ports", "Web cookies"], 0], ["Why inspect ownership and writability together?", ["They determine who can influence privileged content", "They reveal passwords", "They change routes"], 0]]
      },
      advanced: {
        time: "4 hours",
        objectives: ["Audit privilege boundaries defensively", "Correlate execution context and writable influence", "Assess misconfiguration impact without exploiting it", "Create remediation-ready evidence"],
        explanation: [
          "Advanced privilege review models trust boundaries: which principal controls a file, which higher-privilege process consumes it, when it executes, and what validation exists.",
          "A professional finding can demonstrate a dangerous configuration through metadata and a harmless canary file in a dedicated lab path. This preview does not provide kernel exploits, credential attacks, payloads, or persistence."
        ],
        steps: ["Define the privilege-review scope.", "Capture account, group, and sudo policy evidence.", "Inventory special bits and scheduled task metadata.", "Analyze only writable paths within the course lab.", "Write an impact hypothesis and safe validation limit.", "Recommend least-privilege remediation."],
        commands: `work=~/digitalmizzle-ethical-hacking/audit/privilege\ninstall -d -m 700 "$work"\n{\n  date --iso-8601=seconds\n  id\n  getent group | grep -E 'sudo|adm|docker|lxd' || true\n  sudo -l\n  find /usr/bin -xdev \\( -perm -4000 -o -perm -2000 \\) -printf '%M %u:%g %p\\n' 2>/dev/null\n  systemctl list-timers --all --no-pager\n  find ~/digitalmizzle-ethical-hacking -xdev -writable -printf '%M %u:%g %p\\n'\n} | tee "$work/privilege-audit.txt"\nsha256sum "$work/privilege-audit.txt" | tee "$work/SHA256SUMS"`,
        expected: "The report inventories privilege-relevant group context, sudo policy, special bits, timers, and writable course paths. Analysts must add intended function, influence path, impact hypothesis, and remediation before calling anything a finding.",
        troubleshooting: ["Systemd unavailable: document the platform limitation and inspect only approved scheduler metadata.", "Large output: narrow by intended service or lab objective instead of deleting evidence.", "Group membership appears risky: validate actual delegated capability."],
        mistakes: ["Calling configuration inventory a confirmed escalation", "Executing privileged paths to prove impact unnecessarily", "Ignoring containers or service context", "Recommending removal without operational analysis"],
        takeaway: "Advanced privilege analysis traces controllable input to privileged behavior and recommends a proportionate defensive fix.",
        quiz: [["What turns inventory into a finding?", ["A validated influence path and impact", "A long command output", "A tool warning"], 0], ["Why include intended function?", ["To assess risk and remediation accurately", "To increase privileges", "To hide evidence"], 0], ["What is excluded from this preview?", ["Kernel exploits and persistence", "Metadata review", "Reporting"], 0]]
      }
    }
  },
  {
    title: "Reporting, Documentation & Professional Workflow",
    focus: "Evidence to remediation",
    lessons: [
      "Why documentation matters", "Creating a testing timeline", "Capturing screenshots and commands",
      "Risk rating basics", "Writing clear findings", "Explaining impact",
      "Writing remediation advice", "Creating an executive summary", "Building a final report",
      "Cleaning up the lab", "Next learning path"
    ],
    profiles: {
      beginner: {
        time: "3 hours",
        objectives: ["Keep a testing timeline", "Separate evidence from opinion", "Write a simple finding", "Clean up and restore the lab"],
        explanation: [
          "Documentation lets another person understand what you tested, when you tested it, and what you observed. Good notes include scope, commands, results, screenshots, and mistakes.",
          "A finding contains a clear title, observation, impact, evidence, and remediation. Avoid dramatic language and never claim more than your evidence supports."
        ],
        steps: ["Create a report folder.", "Start a timeline with the current date.", "Copy selected lab evidence into the folder.", "Write one sample finding from your local lab.", "Add cleanup actions and snapshot status.", "Create a final archive listing."],
        commands: `work=~/digitalmizzle-ethical-hacking/report\nmkdir -p "$work"/{evidence,screenshots}\ndate --iso-8601=seconds | tee "$work/timeline.txt"\nprintf '# Finding Title\\n\\n## Observation\\n## Evidence\\n## Impact\\n## Remediation\\n## Limitations\\n' > "$work/finding.md"\nprintf '# Executive Summary\\n\\n# Scope\\n\\n# Findings\\n\\n# Cleanup\\n' > "$work/final-report.md"\nfind "$work" -maxdepth 2 -type f -print | sort`,
        expected: "The report workspace contains evidence and screenshot folders, a timestamped timeline, a finding template, and a final report structure.",
        troubleshooting: ["Empty evidence folder: copy only reviewed artifacts from earlier modules.", "Unclear impact: describe the practical consequence in the local lab and state uncertainty.", "No screenshot tool: command output and text evidence are acceptable."],
        mistakes: ["Writing from memory after the lab", "Using vague titles", "Mixing remediation into evidence", "Forgetting cleanup and limitations"],
        takeaway: "A useful report is clear, factual, reproducible, and focused on helping the system owner reduce risk.",
        quiz: [["What belongs in a finding?", ["Observation, evidence, impact, and remediation", "Only a screenshot", "An exploit payload"], 0], ["Why include limitations?", ["To state what evidence does not prove", "To hide work", "To increase severity"], 0], ["What should cleanup record?", ["Restored state and removed temporary artifacts", "Deleted all evidence", "Public targets"], 0]]
      },
      intermediate: {
        time: "3.5 hours",
        objectives: ["Build a chronological evidence trail", "Apply a consistent risk rationale", "Write actionable remediation", "Produce technical and executive sections"],
        explanation: [
          "Intermediate reports connect every finding to scope, timestamped evidence, reproduction context, impact, and verification status. Risk should consider likelihood and impact in the actual lab scenario.",
          "Remediation should name the control change, owner, urgency, and retest condition. An executive summary explains overall exposure and priority without drowning the reader in commands."
        ],
        steps: ["Create a structured engagement folder.", "Build an evidence manifest with hashes.", "Write one finding with risk rationale.", "Create a timeline from module artifacts.", "Write an executive summary for a non-technical reader.", "Record cleanup and retest recommendations."],
        commands: `work=~/digitalmizzle-ethical-hacking/final-report\nmkdir -p "$work"/{evidence,findings,appendix}\nfind ~/digitalmizzle-ethical-hacking/evidence -type f -maxdepth 3 -print 2>/dev/null | sort | tee "$work/evidence-manifest.txt"\nfind ~/digitalmizzle-ethical-hacking/evidence -type f -maxdepth 3 -exec sha256sum {} \\; 2>/dev/null | tee "$work/evidence-hashes.txt"\nprintf '# Finding\\n\\nSeverity rationale:\\nObservation:\\nEvidence references:\\nImpact:\\nRemediation:\\nRetest:\\nLimitations:\\n' > "$work/findings/F-001.md"\nprintf '# Executive Summary\\n\\n# Scope and Methodology\\n\\n# Findings Summary\\n\\n# Cleanup and Retest\\n' > "$work/report.md"`,
        expected: "The reporting folder contains an evidence inventory, hashes, a numbered finding template, and a final report outline suitable for the authorized lab engagement.",
        troubleshooting: ["No earlier evidence: document the gap instead of inventing results.", "Hash path contains spaces: the generated output still records the full filename.", "Severity is unclear: lower confidence and explain the assumptions."],
        mistakes: ["Rating severity from scanner labels alone", "Giving generic remediation", "Omitting evidence references", "Using technical detail in the executive summary without context"],
        takeaway: "Professional reporting traces conclusions to evidence and gives the owner a practical path to remediation and retest.",
        quiz: [["What should severity include?", ["Contextual likelihood and impact", "Only a tool score", "The number of commands"], 0], ["What makes remediation actionable?", ["A specific control change and retest condition", "A vague warning", "More scanning"], 0], ["Who is the executive summary for?", ["Decision-makers and non-technical stakeholders", "Only the operator", "Public readers"], 0]]
      },
      advanced: {
        time: "4 hours",
        objectives: ["Create a defensible assessment record", "Express risk, confidence, and limitations", "Map evidence to findings and remediation", "Define cleanup, retest, and residual risk"],
        explanation: [
          "Advanced reporting treats evidence lineage and decision logic as first-class deliverables. Findings distinguish verified facts, analyst inference, affected assets, preconditions, impact, and residual uncertainty.",
          "The final package should support technical reproduction, management prioritization, remediation ownership, and an independent retest without exposing unnecessary sensitive data."
        ],
        steps: ["Create a restricted report workspace.", "Generate an evidence index and integrity manifest.", "Write methodology and rules-of-engagement references.", "Create finding, executive summary, and retest templates.", "Document cleanup verification.", "Package only approved artifacts and record the archive hash."],
        commands: `work=~/digitalmizzle-ethical-hacking/deliverable-$(date +%Y%m%d-%H%M%S)\ninstall -d -m 700 "$work"/{evidence,findings,appendix}\nprintf '# Methodology\\n\\nAuthorization reference:\\nScope:\\nTechniques used:\\nProhibited actions:\\nLimitations:\\n' > "$work/methodology.md"\nprintf '# F-001 Title\\n\\nRisk and confidence:\\nAffected asset:\\nObservation:\\nEvidence lineage:\\nImpact:\\nRoot cause:\\nRemediation owner and action:\\nRetest criteria:\\nResidual risk:\\n' > "$work/findings/F-001.md"\nprintf '# Executive Summary\\n\\nOverall risk:\\nPriority actions:\\nBusiness context:\\n' > "$work/executive-summary.md"\nprintf '# Cleanup Verification\\n\\nTemporary files removed:\\nServices stopped:\\nSnapshots restored:\\nEvidence retained:\\n' > "$work/cleanup.md"\nfind "$work" -type f -exec sha256sum {} \\; | tee "$work/SHA256SUMS"`,
        expected: "The restricted deliverable workspace contains methodology, finding, executive, cleanup, and integrity structures. It is ready to receive reviewed lab evidence but contains no unauthorized data.",
        troubleshooting: ["Evidence cannot support the claim: downgrade or remove the finding.", "Sensitive artifact is unnecessary: exclude it and document the decision.", "Remediation ownership is unknown: flag it as a governance action rather than guessing."],
        mistakes: ["Overstating confidence", "Mixing raw secrets into reports", "Failing to preserve evidence lineage", "Closing a finding without retest criteria"],
        takeaway: "An expert report is evidence-linked, audience-aware, proportionate, and explicit about uncertainty, ownership, and residual risk.",
        quiz: [["What is evidence lineage?", ["The trace from source artifact to conclusion", "A list of tools", "A public timeline"], 0], ["When evidence is insufficient, what should happen?", ["Downgrade or remove the claim", "Increase severity", "Expand scope secretly"], 0], ["What closes the remediation loop?", ["Defined retest criteria and residual risk", "A screenshot alone", "Deleting notes"], 0]]
      }
    }
  }
];

const lessonDetails = [
  [
    ["Ethical rules and lab boundaries", "Introduces the legal and professional limits that make security testing ethical.", "Define ownership, written permission, scope, and stopping conditions before testing.", "Write a scope note naming the one local VM and IP approved for practice.", "Permission and a clearly documented scope come before every tool."],
    ["Lab network validation", "Explains how an isolated lab network prevents vulnerable machines from reaching production or public systems.", "Identify NAT, host-only, and bridged modes and select the safest design.", "Record Kali and target adapter modes, addresses, and intended communication paths.", "Verify isolation from evidence rather than trusting an adapter label."],
    ["Target identification", "Shows how to identify the correct authorized target without guessing addresses.", "Confirm a target IP from its own console and match it to the approved lab inventory.", "Compare the vulnerable VM console address with Kali's host-only subnet.", "A target is identified from approved records and direct validation, not discovery outside scope."],
    ["Port and service discovery", "Introduces ports as network endpoints and services as the programs responding through them.", "Run a bounded scan and distinguish open, closed, and filtered states.", "Scan only LAB_TARGET_IP and save the result in the course evidence folder.", "A port state is an observation, not proof of a vulnerability."],
    ["Service version analysis", "Explains how service detection creates useful but imperfect software fingerprints.", "Interpret product and version guesses while recognizing confidence limits.", "Compare an Nmap service guess with configuration shown on the owned target VM.", "Corroborate fingerprints before using them in a finding."],
    ["Web service enumeration", "Introduces safe inspection of local web response headers, status codes, titles, and exposed paths.", "Understand what HTTP metadata can reveal about an authorized lab application.", "Use curl against the local vulnerable VM and record headers without submitting payloads.", "Collect web facts first; do not confuse unusual metadata with confirmed risk."],
    ["Directory and content discovery", "Explains how hidden or unlinked content can increase application exposure.", "Understand content discovery wordlists, response codes, and false positives conceptually.", "Use only the official lab exercise's approved local paths and document returned status codes.", "Content discovery must be narrowly scoped and interpreted in application context."],
    ["SMB/FTP/SSH basic enumeration", "Introduces common remote services and the information they may expose in a training lab.", "Recognize banners, shares, authentication prompts, and secure configuration expectations.", "Inspect only services already observed on LOCAL_VULNERABLE_VM without using real credentials.", "Protocol checks should follow evidence and never become credential guessing."],
    ["Notes and evidence collection", "Shows how commands, timestamps, output, and screenshots form a reproducible record.", "Separate raw evidence, observations, assumptions, and conclusions.", "Create an enumeration journal and reference saved outputs by filename and time.", "Good notes let another analyst understand exactly what happened."],
    ["Enumeration checklist", "Combines the module into a repeatable preflight, discovery, validation, and documentation sequence.", "Build a checklist that prevents skipped scope and evidence steps.", "Review target, route, commands, outputs, limitations, and cleanup before closing the module.", "A checklist improves consistency without replacing analyst judgment."]
  ],
  [
    ["What exploitation means ethically", "Defines exploitation as controlled validation of a weakness in an authorized environment.", "Distinguish vulnerability research, validation, impact, and prohibited activity.", "Write allowed actions and stop conditions for a deliberately vulnerable local VM.", "Ethical validation proves only what is necessary and stops at the agreed boundary."],
    ["Reading vulnerability descriptions", "Explains the affected product, version, prerequisite, impact, and remediation fields in an advisory.", "Extract testable conditions without treating an advisory as proof.", "Summarize one vulnerability description supplied by the official lab guide.", "An advisory creates a hypothesis that local evidence must validate."],
    ["Matching services to known lab vulnerabilities", "Shows how observed services are compared with the conditions described by a training scenario.", "Map service evidence to affected versions and required configuration safely.", "Create a table linking the authorized VM service, evidence source, and lab scenario.", "A version match alone is not confirmation of exploitability."],
    ["Using Metasploit safely in local labs", "Introduces Metasploit as a framework whose modules must be reviewed and constrained by scope.", "Navigate help, search, and module information without launching unauthorized actions.", "Open the console, inspect help and instructor-approved module metadata, then exit.", "Understand a module before considering any controlled lab validation."],
    ["Manual verification basics", "Explains how a small, non-destructive observation can validate a claim more clearly than automation.", "Design a test with a claim, prerequisite, expected result, and stop condition.", "Write a manual verification plan using harmless local response or configuration evidence.", "The smallest reliable test is usually the best test."],
    ["Web login testing concepts", "Introduces authentication controls, error handling, lockout, session behavior, and rate limits.", "Recognize what a secure login workflow should protect without testing real accounts.", "Observe a training application's supplied demo login flow with designated lab credentials only.", "Authentication testing requires approved accounts and strict limits; never guess real credentials."],
    ["File upload vulnerability concepts", "Explains how unsafe file handling can create risk through type, location, naming, or execution behavior.", "Identify defensive controls such as allowlists, storage separation, and generated filenames.", "Review the local lab's upload design using a harmless text file provided for the exercise.", "File upload risk is reduced by validation, isolation, and non-executable storage."],
    ["Command injection lab concept", "Explains why passing untrusted input to a system shell can create severe impact.", "Understand input-to-command data flow and defensive separation without using payloads.", "Trace a deliberately vulnerable lab diagram and mark where validation should occur.", "Prevent command injection by avoiding shell invocation and validating structured input."],
    ["Reverse shell theory in labs only", "Describes the high-level connection model used in training scenarios without providing shell-delivery instructions.", "Understand listener, outbound connection, session, and containment concepts.", "Draw the data flow between two isolated lab VMs and document why it must never leave the lab.", "Connection theory is studied for defense and containment, not deployment on real systems."],
    ["Post-exploitation boundaries", "Defines what must stop after a lab objective is demonstrated.", "Recognize prohibited browsing, persistence, unrelated data access, and scope expansion.", "Create a stop checklist covering evidence capture, cleanup, snapshot restoration, and reporting.", "Access never removes scope; the original authorization remains the limit."],
    ["Evidence capture during exploitation", "Shows how to record controlled validation without collecting unnecessary sensitive data.", "Capture exact steps, timestamps, limited proof, system state, and cleanup evidence.", "Build a sanitized validation record referencing the local lab target and approved objective.", "Evidence should prove the claim while minimizing data exposure and system change."]
  ],
  [
    ["What privilege escalation is", "Explains how a lower-privilege user may gain greater authority through weakness or misconfiguration.", "Identify privilege boundaries, principals, and the difference between access and authorization.", "Map users, groups, and administrative roles on a learner-owned VM.", "Privilege escalation is a broken trust boundary, not simply a powerful command."],
    ["Linux enumeration after lab access", "Introduces post-access inventory of identity, platform, permissions, and services in a controlled lab.", "Collect only the system facts needed for the approved training objective.", "Record id, OS, kernel, routes, and local listeners on the owned VM.", "Post-access enumeration remains minimal, scoped, and documented."],
    ["Checking users and groups", "Explains how accounts and group membership influence effective permissions.", "Interpret user IDs, group IDs, and delegated administrative groups.", "Compare the current lab account's id output with the VM's intended role.", "Group membership matters only when connected to an actual delegated capability."],
    ["Kernel and OS version checks", "Shows how platform details support compatibility, patch, and exposure analysis.", "Record release and kernel information without assuming an old version is exploitable.", "Capture uname and OS release output in the local evidence directory.", "Version information supports investigation but requires configuration and patch context."],
    ["SUID/SGID concept", "Explains special permission bits that allow execution with file-owner or group privileges.", "Recognize legitimate special-bit use and the conditions that could make it risky.", "Inventory a bounded sample of special-bit files without executing unfamiliar programs.", "A special bit becomes a finding only when a controllable path to impact is validated."],
    ["Writable path and permission issues", "Explains how writable files or directories can affect higher-privilege workflows.", "Analyze ownership, writability, consumer process, and execution context together.", "Create a harmless permission example inside the course folder and inspect its metadata.", "Writability matters when a more privileged process trusts the affected content."],
    ["Scheduled tasks and cron basics", "Introduces automated jobs and the trust placed in their commands, scripts, and paths.", "Read scheduler metadata and identify secure ownership expectations.", "Inspect approved cron or timer listings without changing or triggering jobs.", "Scheduled work should use trusted, non-writable files and explicit paths."],
    ["Misconfiguration awareness", "Combines weak permissions, excessive delegation, insecure defaults, and unsafe service settings.", "Separate configuration observations from demonstrated privilege impact.", "Document one intentionally insecure lab setting and its least-privilege correction.", "Misconfiguration findings need context, impact logic, and a proportionate fix."],
    ["Windows privilege escalation concepts", "Introduces Windows users, groups, services, scheduled tasks, and token boundaries at a conceptual level.", "Recognize defensive review areas without credential theft or exploit procedures.", "Use an instructor-provided Windows lab inventory to identify intended privileged components.", "Windows privilege review follows the same rule: trace controllable input to privileged behavior."],
    ["Safe privilege escalation checklist", "Creates a repeatable sequence for scope, identity, evidence, validation limits, and remediation.", "Know when to stop and how to report an inconclusive result.", "Complete the checklist for the learner-owned VM without attempting escalation.", "A safe checklist prioritizes observation and remediation over gaining access."]
  ],
  [
    ["Why documentation matters", "Explains how documentation supports reproducibility, accountability, remediation, and retesting.", "Identify the minimum records needed for a credible assessment.", "Create a structured engagement folder for scope, evidence, findings, and cleanup.", "If work cannot be explained and reproduced, it cannot be relied upon."],
    ["Creating a testing timeline", "Shows how chronological records connect actions, evidence, and system changes.", "Record timestamps, operator actions, results, and decisions consistently.", "Start a timeline using ISO-formatted timestamps for the authorized lab session.", "A timeline turns scattered activity into a reviewable sequence."],
    ["Capturing screenshots and commands", "Explains how visual evidence and exact commands support a technical claim.", "Capture relevant context while excluding unrelated or sensitive data.", "Save terminal output and one sanitized screenshot from the local lab.", "Evidence should be sufficient, legible, scoped, and minimally sensitive."],
    ["Risk rating basics", "Introduces likelihood, impact, exposure, prerequisites, and confidence.", "Build a contextual severity rationale instead of copying a scanner score.", "Rate a fictional lab finding and state every assumption used.", "Risk is a reasoned judgment tied to context, not a color assigned by a tool."],
    ["Writing clear findings", "Shows how to create precise titles and separate observation, evidence, impact, and remediation.", "Write a finding another analyst and system owner can understand.", "Draft one finding from the authorized lab using the provided template.", "A clear finding states what is wrong, where it is, why it matters, and how to fix it."],
    ["Explaining impact", "Translates technical conditions into realistic consequences for confidentiality, integrity, or availability.", "Avoid exaggerated outcomes and distinguish demonstrated from potential impact.", "Write a two-sentence impact statement constrained to the local lab evidence.", "Impact must follow evidence and prerequisites, not imagination."],
    ["Writing remediation advice", "Explains how specific control changes, ownership, and retest criteria make advice actionable.", "Recommend root-cause fixes rather than hiding symptoms.", "Write a remediation plan with owner, action, priority, and validation step.", "Good remediation is specific, feasible, and testable."],
    ["Creating an executive summary", "Introduces concise communication for decision-makers who do not need command-level detail.", "Summarize scope, overall risk, key themes, and priority actions.", "Write a short executive summary for the fictional lab engagement.", "Executives need decisions and priorities, not a transcript of tools."],
    ["Building a final report", "Combines scope, methodology, limitations, findings, evidence references, and conclusions.", "Assemble technical and management sections into one consistent deliverable.", "Create a report index and link each finding to its evidence artifact.", "A final report is a coherent argument supported by traceable evidence."],
    ["Cleaning up the lab", "Explains removal of temporary files, stopping services, restoring snapshots, and preserving approved evidence.", "Verify the environment is returned to the agreed state.", "Complete and sign a cleanup checklist for both local VMs.", "Responsible testing ends with verified cleanup and retained records."],
    ["Next learning path", "Helps learners identify gaps and select a safe progression into deeper security study.", "Build a development plan from demonstrated skills rather than tool popularity.", "Choose next modules in networking, web labs, defensive monitoring, or reporting.", "Progress comes from deeper methodology, not broader unauthorized activity."]
  ]
];

function lessonCopy(detail, level) {
  const [title, explanation, learn, lab, takeaway] = detail;
  if (level === "beginner") {
    return {
      title,
      badge: "Concept",
      explanation: `${explanation} Technical terms are introduced in plain language so the learner can understand the purpose before using any tool.`,
      learn: `${learn} The emphasis is confidence, safe sequencing, and knowing when to stop.`,
      lab: `${lab} Follow the step only inside the learner-owned or deliberately vulnerable local environment.`,
      takeaway
    };
  }
  if (level === "advanced") {
    return {
      title,
      badge: "Methodology",
      explanation: `${explanation} The professional perspective considers methodology, evidence quality, operational constraints, confidence, and defensible reporting.`,
      learn: `${learn} Analysts also document assumptions, validation logic, limitations, and the relationship between observation and conclusion.`,
      lab: `${lab} Preserve timestamped evidence, define stopping conditions, and record how the result would be communicated and remediated.`,
      takeaway: `${takeaway} Advanced practice requires reproducibility, proportionality, and explicit uncertainty.`
    };
  }
  return {
    title,
    badge: "Practical",
    explanation: `${explanation} This matters because ethical hacking depends on linking each action to a clear assessment objective and observable evidence.`,
    learn: `${learn} The workflow explains why the step is performed, what result is useful, and how to troubleshoot an unexpected outcome.`,
    lab: `${lab} Record the command or action, expected result, actual result, and any limitation in the module notes.`,
    takeaway: `${takeaway} Practical work should remain repeatable and tied to the authorized lab objective.`
  };
}

function renderExpandedLessons(moduleIndex) {
  return lessonDetails[moduleIndex].map((detail, index) => {
    const lesson = lessonCopy(detail, selectedDifficulty);
    return `
      <details class="nested-lesson">
        <summary>
          <span class="nested-lesson-number">${String(modules.slice(0, moduleIndex).reduce((sum, item) => sum + item.lessons.length, 0) + index + 1).padStart(2, "0")}</span>
          <span><strong>${lesson.title}</strong><small>${lesson.explanation}</small></span>
          <b>${lesson.badge}</b>
        </summary>
        <div class="nested-lesson-body">
          <div><h5>What you will learn</h5><p>${lesson.learn}</p></div>
          <div><h5>Practical lab focus</h5><p>${lesson.lab}</p></div>
          <div class="nested-takeaway"><h5>Key takeaway</h5><p>${lesson.takeaway}</p></div>
        </div>
      </details>`;
  }).join("");
}

const escapeHtml = (value) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const list = (items, ordered = false) => `<${ordered ? "ol" : "ul"}>${items.map((item) => `<li>${item}</li>`).join("")}</${ordered ? "ol" : "ul"}>`;
const levelNames = { beginner: "Beginner View", intermediate: "Intermediate View", advanced: "Advanced View" };
let selectedDifficulty = localStorage.getItem("dmzEthicalDifficultyV2") || "intermediate";
if (!levelNames[selectedDifficulty]) selectedDifficulty = "intermediate";
let completed = new Set(JSON.parse(localStorage.getItem(`dmzEthicalProgress-${selectedDifficulty}`) || "[]"));

function renderQuiz(quiz, moduleIndex) {
  return quiz.map((question, questionIndex) => `
    <div class="quiz-question">
      <p>${questionIndex + 1}. ${question[0]}</p>
      <div class="quiz-options">${question[1].map((option, optionIndex) => `
        <label><input type="radio" name="q-${moduleIndex}-${questionIndex}" value="${optionIndex}" data-answer="${question[2]}"> <span>${option}</span></label>
      `).join("")}</div>
      <button class="reveal-answer" type="button" data-reveal-answer>Reveal answer</button>
      <div class="quiz-answer">Correct answer: <strong>${question[1][question[2]]}</strong></div>
    </div>`).join("");
}

function renderLessons(openIndex = null) {
  const target = document.querySelector("#lessonContent");
  target.classList.remove("switching");
  void target.offsetWidth;
  target.classList.add("switching");
  target.innerHTML = modules.map((module, index) => {
    const profile = module.profiles[selectedDifficulty];
    const lessonStart = modules.slice(0, index).reduce((sum, item) => sum + item.lessons.length, 0) + 1;
    return `
      <details class="lesson-card reveal" data-lesson="${index}" ${openIndex === index ? "open" : ""}>
        <summary>
          <span class="lesson-number">${String(index + 1).padStart(2, "0")}</span>
          <span class="lesson-title"><strong>${module.title}</strong><small>${module.focus} / ${module.lessons.length} lessons</small></span>
          <span class="lesson-tags"><span>${levelNames[selectedDifficulty]}</span><span>${profile.time}</span></span>
        </summary>
        <div class="lesson-body">
          <section class="lesson-section"><h4>Module overview</h4>${profile.explanation.map((paragraph) => `<p>${paragraph}</p>`).join("")}<div class="safety-box"><strong>Authorized lab rule</strong>Use only localhost, learner-owned VMs, intentionally vulnerable local machines, CTF-style practice boxes, or written-permission systems. Stop whenever scope is unclear.</div></section>
          <section class="lesson-section"><h4>Learning objectives</h4><div class="objective-grid">${list(profile.objectives)}</div></section>
          <section class="lesson-section"><h4>Lessons in this module</h4><div class="expanded-lessons">${renderExpandedLessons(index)}</div></section>
          <section class="lesson-section"><h4>Step-by-step lab practice</h4>${list(profile.steps, true)}<div class="command-block"><div class="command-label"><span>Authorized local lab only</span><button class="copy-command" type="button" data-copy-command>Copy</button></div><pre><code>${escapeHtml(profile.commands)}</code></pre></div><div class="expected-box"><strong>Expected results and validation</strong>${profile.expected}</div></section>
          <section class="lesson-section"><h4>Troubleshooting and workflow notes</h4>${list(profile.troubleshooting)}</section>
          <section class="lesson-section"><h4>Common mistakes</h4>${list(profile.mistakes)}<div class="takeaway-box"><strong>Key takeaway</strong>${profile.takeaway}</div></section>
          <section class="lesson-section"><h4>Mini quiz</h4><div class="quiz">${renderQuiz(profile.quiz, index)}</div></section>
          <div class="lesson-actions">
            <span class="quiz-status" id="quizStatus-${index}">Answer all three questions, or reveal an answer to study it.</span>
            <div class="lesson-footer-controls">
              <div class="lesson-nav">
                <button class="btn ghost" type="button" data-go="${index - 1}" ${index === 0 ? "disabled" : ""}>Previous Module</button>
                <button class="btn ghost" type="button" data-go="${index + 1}" ${index === modules.length - 1 ? "disabled" : ""}>Next Module</button>
              </div>
              <button class="btn complete-btn" type="button" data-complete="${index}">Mark as complete</button>
            </div>
          </div>
        </div>
      </details>`;
  }).join("");
  target.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
  updateProgress();
}

function updateProgress() {
  const percent = Math.round((completed.size / modules.length) * 100);
  document.querySelector("#progressText").textContent = `${completed.size} of ${modules.length} modules complete / ${percent}%`;
  document.querySelector("#progressBar").style.width = `${percent}%`;
  document.querySelectorAll(".complete-btn").forEach((button) => {
    const done = completed.has(Number(button.dataset.complete));
    button.classList.toggle("completed", done);
    button.textContent = done ? "Completed" : "Mark as complete";
  });
  document.querySelectorAll("[data-difficulty]").forEach((button) => button.classList.toggle("active", button.dataset.difficulty === selectedDifficulty));
  localStorage.setItem(`dmzEthicalProgress-${selectedDifficulty}`, JSON.stringify([...completed]));
}

function openModule(index) {
  if (index < 0 || index >= modules.length) return;
  renderLessons(index);
  document.querySelector(`.lesson-card[data-lesson="${index}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

renderLessons();

document.querySelector(".difficulty-selector").addEventListener("click", (event) => {
  const button = event.target.closest("[data-difficulty]");
  if (!button || button.dataset.difficulty === selectedDifficulty) return;
  selectedDifficulty = button.dataset.difficulty;
  localStorage.setItem("dmzEthicalDifficultyV2", selectedDifficulty);
  completed = new Set(JSON.parse(localStorage.getItem(`dmzEthicalProgress-${selectedDifficulty}`) || "[]"));
  renderLessons(0);
});

document.querySelector("#resetProgress").addEventListener("click", () => {
  completed.clear();
  updateProgress();
});

document.querySelector("#lessonContent").addEventListener("change", (event) => {
  if (!event.target.matches('input[type="radio"]')) return;
  const card = event.target.closest(".lesson-card");
  const index = Number(card.dataset.lesson);
  const questions = [...card.querySelectorAll(".quiz-question")];
  if (!questions.every((question) => question.querySelector("input:checked"))) return;
  const correct = questions.filter((question) => {
    const selected = question.querySelector("input:checked");
    return Number(selected.value) === Number(selected.dataset.answer);
  }).length;
  document.querySelector(`#quizStatus-${index}`).textContent = `${correct}/3 correct. Review any missed explanation before continuing.`;
});

document.querySelector("#lessonContent").addEventListener("click", async (event) => {
  const complete = event.target.closest(".complete-btn");
  if (complete) {
    const index = Number(complete.dataset.complete);
    completed.has(index) ? completed.delete(index) : completed.add(index);
    updateProgress();
    return;
  }

  const copy = event.target.closest("[data-copy-command]");
  if (copy) {
    await navigator.clipboard.writeText(copy.closest(".command-block").querySelector("code").textContent);
    copy.textContent = "Copied";
    setTimeout(() => { copy.textContent = "Copy"; }, 1200);
    return;
  }

  const reveal = event.target.closest("[data-reveal-answer]");
  if (reveal) {
    reveal.nextElementSibling.classList.toggle("visible");
    reveal.textContent = reveal.nextElementSibling.classList.contains("visible") ? "Hide answer" : "Reveal answer";
    return;
  }

  const next = event.target.closest("[data-go]");
  if (next && !next.disabled) openModule(Number(next.dataset.go));
});

