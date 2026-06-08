window.DMZ_TOOL_GUIDES = {
  nmap: {
    name: "Nmap",
    code: "NMAP",
    category: "Reconnaissance",
    platform: "Linux / macOS / Windows",
    status: "AUTHORIZED DISCOVERY READY",
    summary: "A network discovery and service-enumeration utility used by defenders, administrators, and authorized security testers.",
    heroCommand: "$ nmap --reason 127.0.0.1",
    overview: "Nmap sends carefully selected network probes and interprets responses to describe reachable hosts, port states, likely services, and limited operating-system characteristics.",
    does: ["Checks whether an authorized host responds", "Identifies TCP or UDP port states", "Estimates services and versions", "Supports bounded OS-detection concepts", "Exports results for documentation"],
    why: "Defenders use Nmap to validate asset inventories, confirm intended exposure, troubleshoot firewall rules, and compare observed services with approved baselines.",
    platforms: ["Kali Linux and other Linux distributions", "macOS through Homebrew or official packages", "Windows through the official installer", "Portable use in controlled administration environments"],
    installation: {
      methods: ["Kali/Debian: install from trusted APT repositories", "macOS: use Homebrew or the official Nmap package", "Windows: use the signed installer from nmap.org"],
      commands: `sudo apt update\nsudo apt install -y nmap\nnmap --version`
    },
    beginner: {
      guide: "Begin with localhost so every result describes your own machine. Learn the meaning of open, closed, and filtered before scanning a deliberately vulnerable VM.",
      workflow: ["Confirm the target is 127.0.0.1 or your own lab VM", "Run one command", "Read every output column", "Record the result and your interpretation"],
      commands: `nmap 127.0.0.1\nnmap -sV 127.0.0.1`,
      expected: "The first command reports common TCP port states on your own machine. The `-sV` command adds service-detection probes and may show product or version guesses. No open ports is a valid result.",
      options: ["`127.0.0.1` is localhost, meaning your own computer", "`-sV` asks Nmap to estimate services behind open ports", "Port state describes response behavior, not vulnerability"],
      visual: "Example result table: PORT / STATE / SERVICE / VERSION"
    },
    intermediate: {
      guide: "Use a repeatable lab workflow: validate the exact target, select the minimum scan that answers the objective, save output, then corroborate results locally.",
      workflow: ["Record the authorized target from its console", "Validate the route uses the lab adapter", "Run service detection", "Save normal output", "Compare findings with target configuration"],
      commands: `mkdir -p ~/digitalmizzle-tools/nmap\nip route get LAB_TARGET_IP\nnmap -sV -oN ~/digitalmizzle-tools/nmap/services.txt LAB_TARGET_IP\nnmap -Pn LAB_TARGET_IP`,
      expected: "The route command shows the local interface used for the authorized VM. `-oN` creates a readable report. `-Pn` skips host discovery and is appropriate only when the approved lab host is known but does not answer discovery probes.",
      options: ["`-oN` saves normal-format evidence", "`-Pn` changes discovery behavior; it does not create authorization", "Service fingerprints should be validated against owned-system configuration"],
      visual: "Workflow placeholder: scope -> route -> scan -> validate -> document"
    },
    advanced: {
      guide: "Treat Nmap as one evidence source in a defensive exposure audit. Define scope, timing, scan rationale, output format, validation method, confidence, and limitations before collection.",
      workflow: ["Create a restricted evidence directory", "Write scope and methodology", "Capture route and timestamp context", "Collect service and OS observations from localhost", "Hash outputs and document limitations"],
      commands: `work=~/digitalmizzle-tools/nmap-audit-$(date +%Y%m%d-%H%M%S)\ninstall -d -m 700 "$work"\nprintf 'Target: 127.0.0.1\\nScope: local host only\\n' > "$work/scope.txt"\nsudo nmap -sV -O -oN "$work/nmap-localhost-results.txt" 127.0.0.1\ndate --iso-8601=seconds > "$work/timestamp.txt"\nsha256sum "$work"/*.txt | tee "$work/SHA256SUMS"`,
      expected: "The evidence folder contains explicit scope, timestamp, a normal-format localhost report, and integrity values. OS detection may be inconclusive on localhost; document the limitation instead of broadening scope.",
      options: ["`-O` requests OS fingerprinting and usually requires elevated privileges", "OS and service detection are probabilistic", "Hashes support later integrity comparison but do not prove authorship"],
      visual: "Audit placeholder: evidence lineage and confidence matrix"
    },
    examples: ["Inventory services on 127.0.0.1", "Validate one learner-owned vulnerable VM with `nmap LAB_TARGET_IP`", "Confirm firewall changes against an approved service baseline"],
    mistakes: ["Scanning public hosts or networks", "Treating an open port as a confirmed vulnerability", "Expanding from one approved IP to a subnet", "Reporting service guesses as verified facts", "Using more scan options than the objective requires"],
    best: ["Confirm written scope before every scan", "Use the least intrusive scan that answers the question", "Save exact commands and raw output", "Corroborate results from the owned system", "State confidence and limitations"],
    usecases: ["Asset inventory validation", "Firewall and segmentation verification", "Unexpected-service detection", "Change-control checks", "Incident-response exposure review"],
    troubleshooting: ["Host appears down: verify VM power, target address, route, and lab adapter before using `-Pn`", "Service result differs from expectation: validate the owning process locally", "OS detection is inconclusive: record the limitation", "Permission warning: use sudo only for the approved local command that requires it"],
    faqs: [
      ["Is Nmap illegal?", "The tool is legitimate. Permission, target, method, and jurisdiction determine whether a scan is authorized."],
      ["Does an open port mean a system is vulnerable?", "No. It means a network endpoint responded. Risk depends on service, configuration, exposure, and context."],
      ["Why does localhost show no ports?", "Your machine may not have listening services. That is a useful baseline result."],
      ["Can I scan a public website for practice?", "No. Use localhost, your own lab VM, a CTF box, or a written-permission environment."]
    ],
    quiz: [
      ["What does `-sV` request?", ["Service detection", "Password recovery", "Stealth"], 0],
      ["What does an open port prove?", ["A port responded", "A vulnerability exists", "The host is compromised"], 0],
      ["What may replace LAB_TARGET_IP?", ["One owned or explicitly authorized local target", "Any public server", "A random home device"], 0]
    ],
    takeaways: ["Nmap describes network exposure; it does not prove compromise", "Scope validation is part of every command", "Professional results include raw output, interpretation, confidence, and limitations"]
  },

  "burp-suite": {
    name: "Burp Suite Community",
    code: "BURP",
    category: "Web Security",
    platform: "Linux / macOS / Windows",
    status: "LOCAL WEB LAB READY",
    summary: "An intercepting proxy and web-testing workspace for inspecting authorized HTTP requests, responses, application structure, and session behavior.",
    heroCommand: "$ proxy --scope http://127.0.0.1:3000",
    overview: "Burp Suite sits between a configured browser and an authorized web application, allowing learners and professionals to inspect, repeat, and document HTTP traffic.",
    does: ["Intercepts browser requests and responses", "Maps approved application paths in the Target tab", "Repeats individual requests for controlled comparison", "Displays cookies, headers, parameters, and status codes", "Provides Intruder concepts for bounded automation"],
    why: "Security professionals use Burp to understand application behavior, reproduce defects, validate security controls, and preserve precise request/response evidence.",
    platforms: ["Kali Linux package or PortSwigger installer", "Windows installer", "macOS installer", "Java-supported professional workstations"],
    installation: {
      methods: ["Kali: use the packaged Community edition or official PortSwigger installer", "Windows/macOS: use the signed installer from PortSwigger", "Use Burp's dedicated browser for simpler local proxy configuration"],
      commands: `sudo apt update\nsudo apt install -y burpsuite\nburpsuite`
    },
    beginner: {
      guide: "Start with a local training application such as OWASP Juice Shop or DVWA. Learn request, response, method, header, cookie, and session concepts before changing any value.",
      workflow: ["Start the local training application", "Open Burp's browser", "Keep intercept off initially", "Browse one local page", "Inspect the HTTP history", "Send one harmless GET request to Repeater"],
      commands: `# Verify your local training app first:\ncurl -I http://127.0.0.1:3000\n\n# Then open Burp Suite:\nburpsuite`,
      expected: "Curl should return local response headers. Burp's Proxy HTTP history should show requests made by its browser to 127.0.0.1. Repeater lets you resend the selected request and compare the response.",
      options: ["GET normally requests a resource", "POST commonly submits data in a request body", "Headers carry request and response metadata", "Cookies often carry session identifiers and must be protected"],
      visual: "Screenshot placeholder: Proxy HTTP history with local requests"
    },
    intermediate: {
      guide: "Build a controlled workflow around scope, site mapping, request selection, Repeater comparison, and evidence capture. Change one harmless input at a time.",
      workflow: ["Add only the local application to Target scope", "Browse key application functions", "Review Target site map and Proxy history", "Send a request to Repeater", "Compare method, headers, cookies, body, and response", "Record the exact request and observation"],
      commands: `mkdir -p ~/digitalmizzle-tools/burp\ncurl --fail --show-error --dump-header ~/digitalmizzle-tools/burp/headers.txt \\\n  --output ~/digitalmizzle-tools/burp/body.html http://127.0.0.1:3000/\nsha256sum ~/digitalmizzle-tools/burp/* | tee ~/digitalmizzle-tools/burp/SHA256SUMS`,
      expected: "The local evidence folder contains response headers, response body, and hashes. Burp should show the equivalent authorized request so learners can compare browser and command-line observations.",
      options: ["Target scope prevents unrelated browsing from polluting the project", "Repeater supports controlled manual comparison", "Intruder is discussed as automation and remains restricted to supplied lab exercises", "Session analysis requires designated lab accounts only"],
      visual: "Workflow placeholder: scope -> map -> inspect -> repeat -> document"
    },
    advanced: {
      guide: "Use Burp as a controlled evidence and validation platform. Define project scope, handling rules, test cases, request identifiers, confidence, cleanup, and report references.",
      workflow: ["Create an engagement-specific project", "Restrict scope to one local training origin", "Capture a baseline transaction", "Define a non-destructive validation hypothesis", "Compare requests in Repeater", "Export only sanitized, necessary evidence"],
      commands: `work=~/digitalmizzle-tools/burp-audit-$(date +%Y%m%d-%H%M%S)\ninstall -d -m 700 "$work"\nprintf 'Origin: http://127.0.0.1:3000\\nScope: local training app only\\n' > "$work/scope.txt"\ncurl --fail --show-error --dump-header "$work/baseline-headers.txt" \\\n  --output "$work/baseline-body.html" http://127.0.0.1:3000/\ndate --iso-8601=seconds > "$work/timestamp.txt"\nsha256sum "$work"/* | tee "$work/SHA256SUMS"`,
      expected: "The audit folder establishes authorized origin, baseline response, collection time, and integrity values. Burp evidence should reference the same origin and exclude live session secrets from reports.",
      options: ["Project files and traffic logs may contain sensitive data", "Request identifiers support evidence lineage", "Automation should be rate-bounded and explicitly approved", "Findings must separate observation, reproduction, impact, and remediation"],
      visual: "Audit placeholder: request/response evidence lineage"
    },
    examples: ["Inspect GET and POST requests to a local training app", "Compare response headers in Repeater", "Review cookie flags and session behavior using designated lab accounts", "Map approved local application paths"],
    mistakes: ["Proxying normal personal browsing through a training project", "Leaving scope unrestricted", "Testing real websites or accounts", "Changing many request values at once", "Including live session cookies in reports"],
    best: ["Use Burp's browser for isolated lab work", "Set Target scope before testing", "Change one variable at a time", "Save sanitized request/response evidence", "Stop automation when results become unstable"],
    usecases: ["Secure development validation", "Application control verification", "Session-management review", "API request inspection", "Reproduction of reported web defects"],
    troubleshooting: ["No traffic: use Burp's browser or verify proxy settings", "HTTPS warning: use the lab browser and trusted local certificate workflow", "Application breaks under intercept: turn intercept off and use HTTP history", "Too much noise: narrow Target scope and filter out static assets"],
    faqs: [
      ["What is an intercepting proxy?", "A tool that relays browser traffic so authorized requests and responses can be inspected."],
      ["Is Repeater automated?", "No. Repeater is primarily a manual request editor and comparison workspace."],
      ["What is Intruder used for?", "It automates request variations. In this preview it is concept-only and restricted to approved local labs."],
      ["May I test a real login page?", "Only with explicit written authorization and designated test accounts. Use local training applications for learning."]
    ],
    quiz: [
      ["What should be configured before testing?", ["Target scope", "A public target", "Stealth mode"], 0],
      ["What does Repeater support?", ["Controlled manual request comparison", "Persistence", "Password theft"], 0],
      ["What must be removed from report evidence?", ["Unnecessary session secrets", "Status codes", "Authorized scope"], 0]
    ],
    takeaways: ["Burp makes HTTP behavior visible; it does not create permission", "Scope and designated lab accounts are mandatory", "Professional web evidence is precise, sanitized, and reproducible"]
  },

  suricata: {
    name: "Suricata",
    code: "IDS",
    category: "Network Defense",
    platform: "Linux / BSD / Network sensors",
    status: "DEFENSIVE SENSOR READY",
    summary: "A high-performance network threat-detection engine that inspects traffic, evaluates signatures, and produces structured security telemetry.",
    heroCommand: "$ suricata --build-info",
    overview: "Suricata can operate as an intrusion detection system, an inline prevention engine, or an offline packet-analysis tool, producing alerts and protocol metadata for defensive investigation.",
    does: ["Inspects network packets and application protocols", "Evaluates signatures and detection rules", "Writes structured events to eve.json", "Generates alert and flow telemetry", "Supports IDS, IPS, and offline PCAP workflows"],
    why: "Defenders use Suricata to improve network visibility, detect known suspicious patterns, enrich investigations, and feed structured events into SIEM and response workflows.",
    platforms: ["Linux servers and sensors", "BSD-based network appliances", "Containerized lab sensors", "Offline PCAP analysis workstations"],
    installation: {
      methods: ["Kali/Debian: install through trusted APT repositories", "Production sensors: follow the supported distribution or vendor guide", "Rules: use trusted maintained sources and document update cadence"],
      commands: `sudo apt update\nsudo apt install -y suricata\nsuricata -V\nsuricata --build-info`
    },
    beginner: {
      guide: "Learn the difference between IDS and IPS, then inspect version and build information without capturing live traffic. Understand alerts, signatures, and eve.json at a conceptual level.",
      workflow: ["Confirm the installed version", "Review enabled capabilities", "Locate the documented log directory", "Open a supplied sample eve.json", "Identify timestamp, event_type, source, destination, and alert fields"],
      commands: `suricata -V\nsuricata --build-info`,
      expected: "The version command prints the installed Suricata release. Build information lists compiled capabilities such as protocol, capture, and acceleration support. No traffic is captured by these commands.",
      options: ["IDS observes and alerts", "IPS may block traffic when deployed inline", "A signature describes a detection condition", "eve.json stores structured event records"],
      visual: "Screenshot placeholder: simplified eve.json alert event"
    },
    intermediate: {
      guide: "Use a supplied, non-sensitive training PCAP to connect configuration, rules, alert generation, and eve.json analysis in a reproducible offline workflow.",
      workflow: ["Copy the instructor-provided PCAP into a lab folder", "Validate Suricata configuration", "Run offline analysis against that file", "Review alerts and event types", "Document false-positive considerations"],
      commands: `mkdir -p ~/digitalmizzle-tools/suricata-output\nsuricata -T -c /etc/suricata/suricata.yaml\nsuricata -r TRAINING_TRAFFIC.pcap -l ~/digitalmizzle-tools/suricata-output\njq -c 'select(.event_type=="alert")' ~/digitalmizzle-tools/suricata-output/eve.json | head`,
      expected: "Configuration test should report success. Offline analysis creates eve.json in the output folder. The jq filter prints only alert events from the supplied lab capture, if any.",
      options: ["`-T` tests configuration without starting monitoring", "`-r` reads an offline PCAP", "`-l` selects an output directory", "Alert absence can be valid and should be documented"],
      visual: "Workflow placeholder: PCAP -> decode -> rules -> eve.json -> analyst"
    },
    advanced: {
      guide: "Treat Suricata as a monitored detection system. Baseline workload, rule quality, packet loss, event volume, retention, and downstream SIEM behavior before tuning.",
      workflow: ["Record version, build, and configuration state", "Test configuration", "Analyze a controlled PCAP", "Summarize event types and alerts", "Review rule identifiers and confidence", "Document performance and tuning assumptions"],
      commands: `work=~/digitalmizzle-tools/suricata-audit-$(date +%Y%m%d-%H%M%S)\ninstall -d -m 700 "$work"\nsuricata -V | tee "$work/version.txt"\nsuricata --build-info > "$work/build-info.txt"\nsuricata -T -c /etc/suricata/suricata.yaml |& tee "$work/config-test.txt"\nsuricata -r TRAINING_TRAFFIC.pcap -l "$work/output"\njq -r '.event_type' "$work/output/eve.json" | sort | uniq -c | sort -nr | tee "$work/event-summary.txt"\nsha256sum "$work"/*.txt | tee "$work/SHA256SUMS"`,
      expected: "The audit directory preserves platform context, configuration validation, offline output, event-volume summary, and hashes. Analysts should evaluate detection quality and resource assumptions before production deployment.",
      options: ["Performance depends on traffic volume, enabled protocols, rules, capture method, and hardware", "Dropped packets reduce visibility", "Rules require ownership, testing, version control, and review", "IPS deployment requires stronger availability and rollback controls than IDS"],
      visual: "Operations placeholder: sensor health, event rate, packet loss, SIEM pipeline"
    },
    examples: ["Validate Suricata installation and build features", "Analyze an instructor-provided PCAP offline", "Filter eve.json alerts", "Review event-type volume before SIEM ingestion"],
    mistakes: ["Running an untested rule set in production", "Assuming every alert is malicious", "Ignoring packet loss and sensor health", "Enabling IPS without rollback planning", "Collecting traffic without authorization"],
    best: ["Test configuration before service restart", "Use trusted, versioned rules", "Measure false positives and false negatives", "Monitor packet drops and event backlog", "Protect logs because they may contain sensitive metadata"],
    usecases: ["Network intrusion detection", "Incident PCAP analysis", "Threat-hunting telemetry", "SIEM enrichment", "Segmentation and policy validation"],
    troubleshooting: ["Configuration test fails: read the reported file and line before editing", "No eve.json: verify output settings and directory permissions", "No alerts: confirm the PCAP contains relevant traffic and rules are enabled", "High event volume: identify event types and tune deliberately"],
    faqs: [
      ["What is the difference between IDS and IPS?", "IDS observes and alerts; IPS operates inline and may block traffic."],
      ["What is eve.json?", "Suricata's structured JSON event stream containing alerts, flows, protocol records, and other telemetry."],
      ["Does an alert prove compromise?", "No. It is a detection signal that requires context and investigation."],
      ["How are rules updated?", "Use a trusted rule-management process, test changes, and document the version deployed."]
    ],
    quiz: [
      ["What does `-T` do?", ["Tests configuration", "Blocks traffic", "Captures passwords"], 0],
      ["What is eve.json?", ["Structured event telemetry", "A password file", "A firewall rule"], 0],
      ["What should happen before IPS deployment?", ["Testing, capacity planning, and rollback design", "Immediate blocking", "Disabling logs"], 0]
    ],
    takeaways: ["Suricata is a defensive sensor whose output requires analyst context", "Rule quality and sensor health are as important as installation", "Offline PCAP practice is a safe way to learn the detection workflow"]
  },

  john: {
    name: "John the Ripper",
    code: "JOHN",
    category: "Password Auditing",
    platform: "Linux / macOS / Windows",
    status: "DEFENSIVE AUDIT MODE",
    summary: "A password-auditing utility used to assess approved test hashes, benchmark defensive controls, and improve organizational password policy.",
    heroCommand: "$ john --list=formats",
    overview: "John the Ripper processes password hash representations to evaluate resistance against approved auditing methods. It must be used only with synthetic lab data or hashes an organization has explicitly authorized for assessment.",
    does: ["Lists supported hash formats", "Benchmarks local auditing performance", "Tests approved sample hashes", "Supports password-policy assessment", "Helps demonstrate why weak passwords are unsafe"],
    why: "Defenders use controlled password auditing to measure policy effectiveness, identify weak credential practices in approved datasets, and support security-awareness and remediation programs.",
    platforms: ["Kali Linux and other Linux distributions", "macOS builds", "Windows builds", "Controlled offline audit workstations"],
    installation: {
      methods: ["Kali/Debian: install from trusted repositories", "Other platforms: use official Openwall documentation and verified packages", "Keep approved audit data encrypted and access-controlled"],
      commands: `sudo apt update\nsudo apt install -y john\njohn --list=formats\njohn --test`
    },
    beginner: {
      guide: "Begin with format listing and the built-in benchmark. Learn the difference between a password and a one-way hash without using real account data.",
      workflow: ["Confirm the tool version and available formats", "Run the built-in self-test", "Observe that different hash formats have different defensive cost", "Write a password-hygiene takeaway"],
      commands: `john --list=formats\njohn --test`,
      expected: "The format command lists hash types supported by the installed build. The self-test benchmarks implementations using built-in data. It does not attack an account or require external hashes.",
      options: ["A password is secret input", "A hash is a one-way representation used for verification", "Salts make identical passwords produce different stored values", "Slower password hashing can increase resistance to offline guessing"],
      visual: "Screenshot placeholder: format list and benchmark summary"
    },
    intermediate: {
      guide: "Build an approved password-audit plan around synthetic hashes, policy questions, data handling, stop conditions, and aggregate reporting rather than individual exposure.",
      workflow: ["Write the authorization and data-handling scope", "Generate or receive synthetic training hashes", "Identify the expected format", "Run only the instructor-approved lab exercise", "Report aggregate policy outcomes", "Securely remove temporary lab data"],
      commands: `mkdir -p ~/digitalmizzle-tools/john-audit\nchmod 700 ~/digitalmizzle-tools/john-audit\njohn --list=formats | tee ~/digitalmizzle-tools/john-audit/formats.txt\njohn --test |& tee ~/digitalmizzle-tools/john-audit/benchmark.txt\nsha256sum ~/digitalmizzle-tools/john-audit/*.txt | tee ~/digitalmizzle-tools/john-audit/SHA256SUMS`,
      expected: "The restricted folder contains supported-format evidence, a local benchmark, and hashes. No organizational credentials or real-account hashes are included.",
      options: ["Format identification must be verified before an approved audit", "Benchmark speed is not the same as policy risk", "Results should be aggregated and access-controlled", "Stop conditions limit time and data exposure"],
      visual: "Workflow placeholder: authorization -> synthetic data -> benchmark -> policy finding"
    },
    advanced: {
      guide: "Treat password auditing as a governed assurance activity. Define legal basis, data minimization, isolated compute, approved formats, resource limits, retention, reporting thresholds, and remediation ownership.",
      workflow: ["Create a restricted audit workspace", "Record authorization and synthetic-data declaration", "Capture tool capabilities and benchmark context", "Document hardware and time limitations", "Write aggregate findings and policy recommendations", "Verify cleanup"],
      commands: `work=~/digitalmizzle-tools/password-audit-$(date +%Y%m%d-%H%M%S)\ninstall -d -m 700 "$work"\nprintf 'Dataset: synthetic training data only\\nPurpose: defensive benchmark\\n' > "$work/scope.txt"\njohn --list=formats > "$work/formats.txt"\njohn --test |& tee "$work/benchmark.txt"\nuname -a > "$work/platform.txt"\ndate --iso-8601=seconds > "$work/timestamp.txt"\nsha256sum "$work"/*.txt | tee "$work/SHA256SUMS"`,
      expected: "The evidence package records synthetic scope, supported formats, benchmark context, platform, time, and integrity values. It supports defensive methodology without processing real credentials.",
      options: ["Performance measurements depend on build, hardware, format, and configuration", "Real audit data requires stronger controls than this preview", "Reports should focus on policy and aggregate risk", "Remediation may include MFA, stronger hashing, rate limits, and password-manager adoption"],
      visual: "Governance placeholder: approved data, isolated compute, retention, aggregate report"
    },
    examples: ["List supported formats", "Run built-in benchmark tests", "Demonstrate hash concepts with synthetic training data", "Assess password policy through approved aggregate metrics"],
    mistakes: ["Using hashes from real accounts without explicit authorization", "Publishing recovered credentials", "Treating benchmark speed as a complete risk assessment", "Keeping audit data longer than required", "Testing online login systems"],
    best: ["Use synthetic data for learning", "Minimize and encrypt approved audit data", "Define time and resource limits", "Report aggregate outcomes", "Pair password policy with MFA and modern password hashing"],
    usecases: ["Password-policy validation", "Security-awareness demonstrations", "Hash-migration planning", "Defensive benchmark comparison", "Approved credential-hygiene assessments"],
    troubleshooting: ["Unknown format: verify the lab data source and supported-format list", "Benchmark differs from another system: compare build and hardware context", "Tool is missing formats: use the documented supported build rather than random binaries", "Permission error: keep the workspace owner-only"],
    faqs: [
      ["Does John attack online accounts?", "This guide does not. John is primarily an offline auditing tool, and this preview uses built-in or synthetic data only."],
      ["What is a password hash?", "A one-way value used to verify a password without storing the original plaintext."],
      ["Why are salts important?", "They make identical passwords produce different stored hashes and reduce reuse of precomputed work."],
      ["What should an organization report?", "Aggregate policy weaknesses and remediation priorities, not exposed individual credentials."]
    ],
    quiz: [
      ["What data is safest for learning?", ["Synthetic training hashes", "Stolen credentials", "Real customer accounts"], 0],
      ["What does `john --test` do?", ["Runs built-in benchmarks", "Attacks a website", "Creates persistence"], 0],
      ["How should audit outcomes be reported?", ["As controlled aggregate policy findings", "By publishing passwords", "Without authorization"], 0]
    ],
    takeaways: ["Password auditing is a governed defensive activity, not account intrusion", "Built-in benchmarks and synthetic data are sufficient for this preview", "Strong hashing, MFA, password managers, and policy design work together"]
  }
};
