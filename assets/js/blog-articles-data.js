export const BLOG_ARTICLES = {
  "kali-linux-workflow": {
    route: "blog-kali-linux-workflow.html",
    title: "Building a Clean Kali Linux Workflow for Beginners",
    metaTitle: "Building a Clean Kali Linux Workflow for Beginners | DigitalMizzle",
    metaDescription: "Learn how to organize a safe and repeatable Kali Linux lab workflow with folders, notes, updates, snapshots, and ethical cybersecurity practice.",
    category: "Kali Linux",
    author: "DigitalMizzle Team",
    date: "June 4, 2026",
    readTime: "11 min read",
    tags: ["Kali Linux", "Lab Workflow", "Beginner", "Ethical Practice"],
    accent: "cyan",
    dek: "Build a repeatable lab routine that keeps commands, evidence, notes, and virtual machines organized from the first session.",
    preview: {
      id: "why-workflow-matters",
      title: "Why workflow matters in cybersecurity labs",
      paragraphs: [
        "A cybersecurity lab is most useful when another person could understand what you tested, why you tested it, and what happened. A clean workflow turns scattered commands into a repeatable learning process.",
        "Beginners often focus only on getting a tool to run. Professionals also preserve context: the authorized target, the time of the test, the command used, the result, and the conclusion. Building that habit early makes troubleshooting easier and keeps practice ethical."
      ],
      bullets: [
        "Know exactly which system is authorized for testing.",
        "Keep notes and output together for each lab.",
        "Return the virtual machine to a known-good state.",
        "Separate experiments from personal files and accounts."
      ]
    },
    sections: [
      {
        id: "prepare-environment",
        title: "Set up a clean Kali Linux environment",
        paragraphs: [
          "Use Kali inside a dedicated virtual machine whenever possible. A VM provides a clear boundary between security tooling and the host computer, and snapshots make mistakes easier to undo.",
          "Give the VM a descriptive name, allocate only the resources it needs, and use an isolated or host-only network for vulnerable practice targets. Record the VM version, network mode, and snapshot name in your lab journal."
        ],
        h3: "A useful baseline",
        bullets: [
          "Install Kali from the official image and verify the download.",
          "Create a standard non-root user for daily work.",
          "Disable shared clipboard and shared folders unless the lab requires them.",
          "Take a clean snapshot before installing extra tools."
        ]
      },
      {
        id: "create-folders",
        title: "Create a predictable lab folder structure",
        paragraphs: [
          "A single workspace keeps evidence from different exercises from becoming mixed together. The following commands create folders for notes, scan output, reports, screenshots, and approved tools."
        ],
        commands: [
          {
            code: "mkdir -p ~/digitalmizzle-labs/{notes,scans,reports,screenshots,tools}\ncd ~/digitalmizzle-labs\ntree",
            explanation: "The first line creates the complete folder structure. The second enters the workspace. The final command displays the folders as a tree; if tree is not installed, use ls instead."
          }
        ],
        bullets: [
          "Create a separate subfolder for every course lab or authorized target.",
          "Use dates or ticket numbers in report names.",
          "Never place real passwords, tokens, or private customer data in screenshots."
        ]
      },
      {
        id: "organize-notes",
        title: "Keep notes organized while you work",
        paragraphs: [
          "Write notes during the lab, not from memory afterward. Begin with the objective, scope, and expected outcome. Then record each meaningful command and the observation it produced.",
          "Good notes distinguish facts from assumptions. For example, an open port is an observation; identifying the business purpose of that service may require further validation."
        ],
        commands: [
          {
            code: "date >> notes/lab-journal.txt\nhostname -I >> notes/lab-journal.txt",
            explanation: "These safe commands append the current date and the Kali VM's local IP addresses to the journal, giving the session useful context."
          }
        ],
        h3: "A simple note template",
        bullets: [
          "Objective and written authorization",
          "Lab target and network boundary",
          "Commands and results",
          "Screenshots or evidence references",
          "Conclusion and next safe step"
        ]
      },
      {
        id: "update-safely",
        title: "Update Kali safely",
        paragraphs: [
          "Update from official Kali repositories before a planned lab, not halfway through an important exercise. Read package prompts, keep the VM powered, and snapshot first when the change is significant.",
          "An update refreshes package information; an upgrade installs newer versions. Review the proposed changes before approving them in a professional environment."
        ],
        commands: [
          {
            code: "sudo apt update\nsudo apt upgrade -y",
            explanation: "The first command refreshes package indexes. The second installs available upgrades. The -y option accepts prompts automatically, so beginners should remove it when they want to review every change."
          }
        ],
        safety: "Only use repositories configured by the official Kali image or a trusted organizational mirror. Do not paste unknown repository commands from forums."
      },
      {
        id: "snapshots",
        title: "Use snapshots as recovery points",
        paragraphs: [
          "Snapshots capture the state of a virtual machine before a change. Take one after the base installation, another after stable updates, and a temporary snapshot before risky configuration work.",
          "Snapshots are not backups. Export important notes and reports to approved storage, because a damaged VM or deleted virtual disk can also remove its snapshots."
        ],
        bullets: [
          "Name snapshots with a date and purpose.",
          "Restore only when the VM is shut down unless the hypervisor documents otherwise.",
          "Delete obsolete snapshots to avoid long chains and storage growth."
        ]
      },
      {
        id: "separate-work",
        title: "Separate personal and lab work",
        paragraphs: [
          "Do not sign into personal email, cloud storage, or social accounts from a security-testing VM. Keep browser profiles, SSH keys, API tokens, and saved passwords outside the lab.",
          "Use intentionally vulnerable local applications and machines for practice. Never point tools at public systems, nearby Wi-Fi networks, or devices that are outside your written scope."
        ],
        safety: "Permission and scope come before every scan or test. Owning a tool does not grant permission to use it against someone else's system."
      },
      {
        id: "document-results",
        title: "Document commands and results",
        paragraphs: [
          "A professional report explains both what happened and what it means. Preserve raw output, then write a short interpretation that a reviewer can understand without rerunning the lab.",
          "Include timestamps, tool versions, target identifiers, limitations, and remediation ideas. Avoid overstating a finding when the evidence is incomplete."
        ],
        h3: "Evidence quality checklist",
        bullets: [
          "The command and relevant options are visible.",
          "The authorized target is clearly identified.",
          "Sensitive information is redacted.",
          "The conclusion is supported by the saved result."
        ]
      },
      {
        id: "beginner-checklist",
        title: "Beginner workflow checklist",
        bullets: [
          "Confirm written authorization and lab scope.",
          "Start from a clean, updated snapshot.",
          "Create a dedicated folder for the exercise.",
          "Record the date, local IP, and objective.",
          "Run only the commands required by the lesson.",
          "Save useful output and explain what it shows.",
          "Remove sensitive data before sharing.",
          "Restore or shut down the lab when finished."
        ],
        takeaway: "A clean workflow is not paperwork added after technical work. It is the structure that makes technical work safe, repeatable, and useful."
      }
    ],
    takeaways: [
      "Use a dedicated virtual machine and an isolated network.",
      "Keep notes, scans, reports, and screenshots in predictable folders.",
      "Snapshot before major changes and back up important evidence separately.",
      "Test only systems you own or have written permission to assess."
    ]
  },
  "siem-detection-basics": {
    route: "blog-siem-detection-basics.html",
    title: "SIEM Detection Basics: From Noisy Logs to Useful Alerts",
    metaTitle: "SIEM Detection Basics: From Noisy Logs to Useful Alerts | DigitalMizzle",
    metaDescription: "Understand SIEM logs, events, alerts, tuning, and practical SOC workflows for building useful defensive detections with fewer false positives.",
    category: "Blue Team",
    author: "DigitalMizzle Team",
    date: "May 28, 2026",
    readTime: "13 min read",
    tags: ["SIEM", "Detection Engineering", "SOC", "Blue Team"],
    accent: "pink",
    dek: "Learn how analysts turn high-volume telemetry into explainable alerts that support reliable investigation and response.",
    preview: {
      id: "what-is-siem",
      title: "What a SIEM actually does",
      paragraphs: [
        "A Security Information and Event Management platform collects records from many systems, normalizes them, and helps analysts search, correlate, alert, and report on security-relevant activity.",
        "A SIEM is not automatically intelligent. Its value depends on log quality, useful context, carefully designed detections, and a repeatable analyst workflow. Sending every available record into one platform without a plan usually produces cost and noise rather than clarity."
      ],
      bullets: [
        "Collect telemetry from important systems.",
        "Normalize fields so different sources can be compared.",
        "Correlate activity across identities, hosts, and time.",
        "Create alerts that lead to a clear analyst decision."
      ]
    },
    sections: [
      {
        id: "noise",
        title: "Why logs become noisy",
        paragraphs: [
          "Modern environments generate routine authentication retries, software updates, automated health checks, vulnerability scans, and service-to-service traffic. A rule that ignores this normal behavior may alert thousands of times.",
          "Noise also comes from missing context. An IP address means little without knowing whether it belongs to a server, employee laptop, security scanner, or approved cloud service."
        ],
        bullets: [
          "Rules are too broad or use a single weak indicator.",
          "Assets and identities lack ownership or criticality data.",
          "Expected automation is not documented.",
          "Duplicate logs arrive from multiple collectors."
        ]
      },
      {
        id: "data-language",
        title: "Logs, events, alerts, and incidents",
        paragraphs: [
          "A log is a record produced by a system. An event is an interpreted occurrence, such as a successful login. An alert is a rule or analytic indicating that an event pattern deserves review. An incident is a confirmed security issue requiring coordinated response.",
          "Keeping these terms distinct prevents teams from treating every alert as a breach. Most alerts need validation, and many will be explained by legitimate activity."
        ],
        h3: "A simple progression",
        bullets: [
          "Log: a server records five failed authentication attempts.",
          "Event: the SIEM groups the attempts by account and source.",
          "Alert: the pattern exceeds an approved threshold.",
          "Incident: investigation confirms unauthorized access or material risk."
        ]
      },
      {
        id: "log-sources",
        title: "Common log sources",
        paragraphs: [
          "Start with sources that answer high-value questions. Authentication systems explain who accessed what. Firewalls show permitted and blocked connections. Endpoint tools add process and host context. Web servers show requests, status codes, and client activity."
        ],
        subsections: [
          { title: "Authentication logs", text: "Useful fields include user, source, destination, result, authentication method, and timestamp. Monitor both failures and unusual successes." },
          { title: "Firewall logs", text: "Use source, destination, port, action, rule name, and bytes transferred to understand network decisions." },
          { title: "Endpoint logs", text: "Process creation, parent process, command-line metadata, file activity, and security product verdicts support host investigations." },
          { title: "Web server logs", text: "Request path, method, response code, user agent, source, and response size help identify application behavior and errors." }
        ]
      },
      {
        id: "useful-detections",
        title: "Build useful detections",
        paragraphs: [
          "Begin with a defined behavior and a decision an analyst can make. State the data source, required fields, expected false positives, severity, owner, and response steps before enabling an alert.",
          "Useful detections combine signals. A failed login may be routine; repeated failures followed by a successful login from a new source can deserve more attention."
        ],
        h3: "Detection design questions",
        bullets: [
          "What behavior are we trying to identify?",
          "Which reliable fields prove that behavior?",
          "What legitimate activity looks similar?",
          "What context should the alert include?",
          "What action should the analyst take next?"
        ]
      },
      {
        id: "safe-examples",
        title: "Safe detection examples",
        subsections: [
          { title: "Failed login monitoring", text: "Group failed attempts by account and source within a short time window. Exclude documented test accounts only after the exclusion is reviewed." },
          { title: "Multiple failures from one source", text: "Raise priority when one source attempts several accounts, while checking whether the source is an approved identity service or scanner." },
          { title: "New admin account created", text: "Alert on privileged account creation and enrich the alert with the actor, target account, host, ticket reference, and approval status." },
          { title: "Suspicious PowerShell concept", text: "Defenders can look for unusual encoded or hidden execution characteristics, then validate the parent process, user role, and approved administration activity. This is a defensive concept, not a bypass guide." },
          { title: "Unusual outbound connection concept", text: "Compare new destinations, uncommon ports, asset role, and historical baseline. A new connection is a reason to investigate, not automatic proof of compromise." }
        ],
        safety: "Detection examples should be tested with synthetic events or approved lab telemetry. Do not generate harmful activity on production systems merely to test an alert."
      },
      {
        id: "reduce-false-positives",
        title: "Reduce false positives without hiding risk",
        paragraphs: [
          "Tune with evidence. Review alert history, identify repeatable legitimate causes, and make the narrowest safe change. Broad exclusions such as ignoring an entire administrator group can create dangerous blind spots.",
          "Thresholds should reflect the environment. A small office and a global identity platform will not share the same normal volume."
        ],
        bullets: [
          "Use allowlists with an owner, reason, and expiry date.",
          "Add asset criticality and identity role to severity.",
          "Suppress exact duplicates while preserving the event count.",
          "Review silent rules regularly to ensure telemetry still arrives."
        ]
      },
      {
        id: "soc-workflow",
        title: "A basic SOC analyst workflow",
        paragraphs: [
          "Triage begins by confirming the alert time, affected identity or asset, data source health, and rule logic. The analyst then gathers related events, compares the activity with a baseline, and documents a supported conclusion.",
          "Escalate when impact or intent remains plausible and the next step requires broader coordination. Close an alert only with a clear reason and enough evidence for another analyst to understand the decision."
        ],
        bullets: [
          "Validate the alert and source data.",
          "Enrich with identity, asset, and change context.",
          "Build a short timeline.",
          "Classify the result and record evidence.",
          "Escalate, contain, or close according to procedure."
        ]
      },
      {
        id: "reporting",
        title: "Reporting and documentation",
        paragraphs: [
          "Detection documentation should include purpose, logic, data dependencies, severity, known false positives, tuning history, owner, and validation date. This turns an individual query into a maintainable control.",
          "Operational reports should distinguish alert volume from security outcomes. Track useful measures such as validated incidents, time to triage, recurring root causes, and detections with missing telemetry."
        ],
        takeaway: "A good alert is explainable, actionable, and supported by trustworthy data. More alerts do not automatically mean better detection."
      }
    ],
    takeaways: [
      "A SIEM organizes evidence; it does not replace analyst judgment.",
      "Design alerts around clear behaviors and decisions.",
      "Tune narrowly with context, ownership, and expiry dates.",
      "Document logic and validation so detections remain maintainable."
    ]
  },
  "nethunter-mobile-labs": {
    route: "blog-nethunter-mobile-labs.html",
    title: "NetHunter Mobile Labs: Responsible Practice Setup",
    metaTitle: "NetHunter Mobile Labs: Responsible Practice Setup | DigitalMizzle",
    metaDescription: "Learn how to plan an isolated, legal Kali NetHunter mobile security lab with safe network boundaries, documentation, and responsible practice.",
    category: "Mobile Security",
    author: "DigitalMizzle Team",
    date: "May 20, 2026",
    readTime: "12 min read",
    tags: ["NetHunter", "Mobile Security", "Lab Safety", "Android"],
    accent: "violet",
    dek: "Plan a controlled mobile security learning environment with clear authorization, isolated networks, and evidence-focused practice.",
    preview: {
      id: "what-is-nethunter",
      title: "What Kali NetHunter is",
      paragraphs: [
        "Kali NetHunter is a mobile penetration-testing platform designed for supported Android devices and authorized security labs. It brings selected Kali tools and mobile workflows into a portable environment.",
        "Portability does not change the rules. Wireless signals and nearby devices cross physical boundaries easily, so a mobile lab needs stronger scope discipline than many isolated virtual-machine exercises."
      ],
      bullets: [
        "Use a supported spare device, not a daily personal phone.",
        "Practice only on devices and networks you own or are authorized to assess.",
        "Keep the lab isolated from neighbors, guests, and production systems.",
        "Document every target and permitted activity before testing."
      ]
    },
    sections: [
      {
        id: "responsible-use",
        title: "Responsible use and legal boundaries",
        paragraphs: [
          "Written permission, a defined target list, and an agreed time window are the minimum starting points for security testing. Local laws may also regulate radio use, interception, privacy, and device modification.",
          "A learning objective such as inspecting your own test application's traffic is specific and measurable. A vague objective such as exploring nearby networks is not an acceptable lab scope."
        ],
        safety: "Never test public Wi-Fi, neighboring networks, workplace infrastructure, or another person's phone without explicit written authorization."
      },
      {
        id: "isolation",
        title: "Why mobile labs must be isolated",
        paragraphs: [
          "Mobile tools interact with radio and network environments that may contain unintended targets. Isolation reduces the chance of collecting unrelated traffic or sending tests outside the lab.",
          "Use a dedicated access point with no connection to the household or business network. Prefer a shielded or physically controlled space when experimenting with radio-capable hardware, and follow local regulations."
        ],
        h3: "A safe conceptual layout",
        bullets: [
          "One dedicated NetHunter learning device",
          "One lab-only access point with a unique SSID",
          "One intentionally vulnerable local application or test device",
          "No route to production, guest, or public networks",
          "A separate administrator device for recovery and documentation"
        ]
      },
      {
        id: "device-preparation",
        title: "Device preparation basics",
        paragraphs: [
          "Check official compatibility information before modifying a device. Back up data, understand warranty implications, and obtain recovery images before changing boot or operating-system components.",
          "Do not store personal photos, financial apps, password managers, or primary authentication tokens on the lab device. Use unique lab accounts and revoke them when the exercise ends."
        ],
        bullets: [
          "Record device model, build, patch level, and installation source.",
          "Use official images and verify checksums where provided.",
          "Enable a screen lock and encrypt stored lab notes.",
          "Prepare a documented restore procedure before installation."
        ]
      },
      {
        id: "network-design",
        title: "Design the lab network",
        paragraphs: [
          "Assign a private subnet exclusively to the lab and list every approved IP address. Disable upstream internet access during exercises that do not require updates or documentation lookup.",
          "Capture only the traffic created by your own test devices. If a packet capture includes unrelated data, stop, delete it safely, and correct the boundary before continuing."
        ],
        h3: "Boundary record",
        bullets: [
          "Permitted SSID and private subnet",
          "Authorized device names and hardware addresses",
          "Allowed applications and test cases",
          "Start and stop time",
          "Data retention and deletion plan"
        ]
      },
      {
        id: "wifi-concepts",
        title: "Safe Wi-Fi learning concepts",
        paragraphs: [
          "A responsible Wi-Fi lab can teach channel planning, encryption choices, client isolation, signal boundaries, and defensive monitoring without attacking real users.",
          "Compare secure configuration options on your dedicated access point and observe how authorized devices appear in the router's management interface. Avoid credential capture, deauthentication, impersonation, or any activity affecting third parties."
        ],
        safety: "This guide intentionally excludes interception, credential capture, bypass, stealth, and disruption instructions."
      },
      {
        id: "android-learning",
        title: "Android security learning",
        paragraphs: [
          "Use a locally developed sample application or an intentionally vulnerable training app. Study permissions, secure storage, network security configuration, and update behavior from a defensive perspective.",
          "Document the app version, test account, device state, and expected behavior. Remove test data and accounts after the lab."
        ],
        subsections: [
          { title: "Permissions review", text: "Compare requested permissions with the application's actual purpose and note unnecessary access." },
          { title: "Data storage review", text: "Confirm that sensitive test data is not exposed in screenshots, backups, logs, or shared storage." },
          { title: "Network review", text: "Observe your own application's connections inside the isolated lab and verify that transport protections are configured." }
        ]
      },
      {
        id: "documentation",
        title: "Document mobile testing",
        paragraphs: [
          "Mobile evidence should identify the device, operating-system build, application version, network boundary, and exact test condition. Screenshots need timestamps and redaction when they contain identifiers.",
          "Write findings in defensive language: observation, risk, evidence, and remediation. Do not preserve unnecessary personal or unrelated network data."
        ],
        bullets: [
          "State authorization and scope first.",
          "Record changes made to the device.",
          "Separate observations from conclusions.",
          "Include a restore and cleanup record."
        ]
      },
      {
        id: "what-not-to-do",
        title: "What not to do",
        bullets: [
          "Do not explore or test networks simply because they are visible.",
          "Do not collect credentials, messages, or traffic from other people.",
          "Do not use the lab device for stealth, persistence, or bypass activity.",
          "Do not connect an intentionally vulnerable device to a production network.",
          "Do not publish screenshots containing private identifiers or access details."
        ],
        safety: "Stop immediately if a test reaches an unintended device or network. Preserve only the minimum information needed to document the boundary issue, then correct the lab design."
      },
      {
        id: "beginner-checklist",
        title: "Responsible mobile lab checklist",
        bullets: [
          "Use a supported spare device and official installation guidance.",
          "Back up and prepare a recovery path.",
          "Write the target list and permitted tests.",
          "Isolate the access point from production and public networks.",
          "Use only lab accounts and intentionally vulnerable applications.",
          "Record results without collecting unrelated data.",
          "Restore, revoke accounts, and delete test data after the exercise."
        ],
        takeaway: "A well-designed mobile lab proves that learning objectives can be achieved without exposing nearby people, devices, or networks to risk."
      }
    ],
    takeaways: [
      "Portability increases the need for strict scope and isolation.",
      "Use dedicated devices, lab accounts, and a private access point.",
      "Focus on defensive Android and network configuration concepts.",
      "Exclude interception, disruption, bypass, and unauthorized testing."
    ]
  }
};
