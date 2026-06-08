const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

document.querySelectorAll(".module").forEach((module) => {
  module.addEventListener("toggle", () => {
    if (!module.open) return;
    document.querySelectorAll(".module[open]").forEach((other) => {
      if (other !== module) other.removeAttribute("open");
    });
  });
});

const lessons = [
  {
    title: "Introduction to Kali Linux", focus: "Orientation", time: "35 min",
    objectives: ["Define Kali Linux and its professional purpose", "Identify differences between Kali and general Linux distributions", "Apply legal and ethical usage rules", "Follow a safe beginner workflow"],
    explanation: [
      "Kali Linux is a Debian-based distribution maintained for penetration testing, digital forensics, security research, and defensive validation. It includes a curated collection of security tools, but the operating system itself does not grant permission to test anything.",
      "Unlike general-purpose distributions, Kali prioritizes security tooling and lab workflows rather than everyday desktop use. Beginners use it inside a virtual machine so mistakes are contained, snapshots are available, and testing can remain isolated."
    ],
    steps: ["Start your own Kali virtual machine.", "Open the Terminal from the application menu.", "Run each command one line at a time.", "Compare the output with the notes below and record anything unfamiliar."],
    commands: `whoami\nhostname\nuname -a\nlsb_release -a\npwd\ndate`,
    expected: "`whoami` displays your current user. `hostname` identifies the VM. `uname -a` reports kernel and architecture details. `lsb_release -a` shows Kali release information. `pwd` prints the current directory, and `date` shows system date and time.",
    mistakes: ["Assuming Kali makes activity automatically legal", "Running commands without reading their purpose", "Using Kali as a target against systems outside the lab"],
    takeaway: "Kali Linux is a professional security testing distribution. Use it only in your own lab or with permission.",
    safety: "Keep every activity inside your own Kali VM or an explicitly authorized lab.",
    quiz: [["What gives you permission to test a system?", ["Installing Kali Linux", "Owning the system or receiving written permission", "Knowing its IP address"], 1], ["Why use a virtual machine?", ["To isolate practice and use snapshots", "To hide activity", "To access public targets"], 0], ["What does `pwd` show?", ["Current directory", "Password database", "Public IP"], 0]]
  },
  {
    title: "Installing Kali Linux in a Virtual Lab", focus: "Lab setup", time: "55 min",
    objectives: ["Explain why virtualization is safer", "Configure suitable VM resources", "Choose NAT or host-only networking correctly", "Validate the first boot"],
    explanation: [
      "VirtualBox and VMware run Kali as a guest operating system on your normal computer. This gives beginners isolation, easy recovery, and control over networking.",
      "Use at least 4 GB RAM, two CPU cores, and 40 GB dynamically allocated disk space. NAT provides internet access through the host. Host-only networking isolates communication between your host and lab VMs. Bridged networking places the VM directly on the physical network and is not recommended for beginner vulnerable labs.",
      "Create a clean snapshot after installation and updates. Enable shared clipboard or drag-and-drop only when needed because these features reduce isolation."
    ],
    steps: ["Download Kali only from the official Kali website.", "Create a Linux/Debian 64-bit VM with 4-8 GB RAM, 2 CPU cores, and 40 GB disk.", "Use NAT during installation and updates.", "Install the guest tools offered by your hypervisor.", "Create a snapshot named `Clean Install`.", "Run the validation commands."],
    commands: `ip a\nping -c 4 8.8.8.8\nping -c 4 google.com\ndf -h\nfree -h\nsudo reboot`,
    expected: "`ip a` shows interfaces. A successful ping to `8.8.8.8` confirms network routing; a successful ping to `google.com` also confirms DNS. `df -h` reports disk capacity, and `free -h` reports memory. `sudo reboot` restarts the VM.",
    mistakes: ["Assigning too much RAM and starving the host", "Using bridged mode for a vulnerable VM", "Skipping a clean snapshot", "Downloading an ISO from an unofficial mirror"],
    takeaway: "A well-isolated VM lets you learn, reset mistakes, and control exactly what the lab can reach.",
    safety: "Never expose an intentionally vulnerable VM through bridged networking or port forwarding.",
    troubleshooting: ["No internet: confirm the adapter is enabled and set to NAT, then renew or reboot.", "Small display: install VirtualBox Guest Additions or VMware Tools.", "Wrong keyboard: update the keyboard layout in Kali settings.", "Slow VM: close host applications and verify virtualization is enabled in BIOS/UEFI."],
    quiz: [["Which mode is best for internet updates?", ["NAT", "Host-only", "Disconnected"], 0], ["Which mode is best for an isolated two-VM lab?", ["Bridged", "Host-only", "Public Wi-Fi"], 1], ["Why create a snapshot?", ["To restore a known state", "To increase internet speed", "To grant authorization"], 0]]
  },
  {
    title: "Linux Terminal Basics", focus: "Core skills", time: "50 min",
    objectives: ["Read a shell prompt", "Use command, option, and argument structure", "Navigate directories", "Create and inspect a practice workspace"],
    explanation: [
      "The terminal is a text interface to the shell. A prompt usually shows the user, hostname, and current location. Commands follow a pattern: command, optional flags, then arguments. For example, `ls -la /home` uses `ls` as the command, `-la` as options, and `/home` as the argument.",
      "Use manual pages and `--help` before running unfamiliar commands. Command history is useful for learning, but always inspect a recalled command before pressing Enter."
    ],
    steps: ["Identify the current directory.", "Move between `/home`, your home directory, and the parent directory.", "Inspect standard and hidden files.", "Create a dedicated DigitalMizzle practice folder and an empty notes file."],
    commands: `pwd\nls\nls -la\ncd /home\ncd ~\ncd ..\nclear\nhistory\nman ls\nls --help\necho "Welcome to DigitalMizzle"\nmkdir ~/digitalmizzle-lab\ncd ~/digitalmizzle-lab\ntouch notes.txt\nls -la`,
    expected: "Navigation commands change or report location. `ls -la` includes hidden files and details. `man ls` opens documentation; press `q` to exit. The final commands create `~/digitalmizzle-lab`, add `notes.txt`, and display it.",
    mistakes: ["Typing paths with the wrong letter case", "Forgetting that spaces separate arguments", "Running copied commands before understanding them"],
    takeaway: "Terminal confidence comes from small, repeatable actions and checking the result after every command.",
    safety: "These commands operate only in your home directory. Keep practice files there while learning.",
    quiz: [["What does `~` represent?", ["Root filesystem", "Your home directory", "Previous command"], 1], ["Which option shows hidden files?", ["`ls -la`", "`ls -h` only", "`pwd`"], 0], ["How do you exit a man page?", ["Press q", "Delete the terminal", "Run sudo"], 0]]
  },
  {
    title: "Files, Permissions, and Users", focus: "Linux fundamentals", time: "55 min",
    objectives: ["Recognize important Linux directories", "Create, copy, move, and read files", "Interpret read, write, and execute permissions", "Use sudo carefully"],
    explanation: [
      "`/home` stores user data, `/etc` stores system configuration, `/var` contains changing data such as logs, `/opt` is commonly used for optional software, and `/tmp` contains temporary files.",
      "Permissions are represented as read (`r`), write (`w`), and execute (`x`) for owner, group, and others. Mode `600` gives the owner read/write access only. Mode `644` gives the owner read/write and everyone else read-only access. `sudo` runs one authorized command with elevated privileges."
    ],
    steps: ["Create a permissions practice directory.", "Create and populate a text file.", "Copy and rename the backup.", "Inspect permissions before and after safe changes.", "Compare normal and elevated user identity."],
    commands: `mkdir -p ~/digitalmizzle-lab/permissions\ncd ~/digitalmizzle-lab/permissions\ntouch demo.txt\necho "Cybersecurity learning file" > demo.txt\ncat demo.txt\ncp demo.txt backup-demo.txt\nmv backup-demo.txt renamed-demo.txt\nls -l\nchmod 600 demo.txt\nls -l\nchmod 644 demo.txt\nls -l\nwhoami\nid\nsudo whoami`,
    expected: "The text is written to `demo.txt`, copied, and renamed. `ls -l` displays permission changes such as `-rw-------` for mode 600 and `-rw-r--r--` for mode 644. `sudo whoami` should return `root` after authentication.",
    mistakes: ["Using `rm` without confirming the path", "Applying recursive permissions to system directories", "Using sudo for ordinary home-folder work"],
    takeaway: "Understand ownership and permissions before changing them; elevated access should be brief and intentional.",
    safety: "Do not randomly delete system files or change permissions on system directories.",
    quiz: [["What does permission 600 allow?", ["Owner read/write only", "Everyone full access", "Owner execute only"], 0], ["Where are many system configurations stored?", ["/etc", "/home", "/tmp only"], 0], ["What does sudo do?", ["Runs an authorized command with elevated privileges", "Scans a network", "Deletes logs"], 0]]
  },
  {
    title: "Networking Basics in Kali", focus: "Connectivity", time: "55 min",
    objectives: ["Identify interfaces and local addresses", "Explain gateway and DNS roles", "Test local, internet, and DNS connectivity", "Recognize listening ports"],
    explanation: [
      "An IP address identifies an interface on a network. A MAC address identifies a network interface at the local-link layer. The default gateway carries traffic beyond the local network, while DNS translates names such as `google.com` into IP addresses.",
      "Private local addresses are used inside home and lab networks; a public IP represents internet-facing connectivity. Lab isolation prevents vulnerable systems from becoming reachable outside the authorized environment."
    ],
    steps: ["Use `ip a` and `hostname -I` to find Kali's lab address.", "Inspect the default route and DNS resolver.", "Ping loopback to test the local network stack.", "Test routing with `8.8.8.8`, then DNS with `google.com`.", "Inspect services listening on your own Kali VM."],
    commands: `ip a\nip route\ncat /etc/resolv.conf\nhostname -I\nping -c 4 127.0.0.1\nping -c 4 8.8.8.8\nping -c 4 google.com\nss -tuln`,
    expected: "`ip a` lists interfaces and addresses. `ip route` usually shows a `default via` gateway. Loopback ping should succeed locally. If the numeric internet ping works but the hostname ping fails, investigate DNS. `ss -tuln` lists TCP/UDP ports listening on your own VM.",
    mistakes: ["Confusing a private lab IP with a public IP", "Treating a listening port as proof of a vulnerability", "Troubleshooting DNS before checking basic routing"],
    takeaway: "Test networking in layers: local stack, interface, gateway, internet route, then DNS.",
    safety: "Inspect only your own machine and authorized lab network. Do not probe neighboring or public systems.",
    quiz: [["What translates names into IP addresses?", ["DNS", "RAM", "chmod"], 0], ["What does 127.0.0.1 represent?", ["Your local machine", "Your router", "A public target"], 0], ["What does `ss -tuln` show?", ["Local listening sockets", "Passwords", "Remote vulnerabilities"], 0]]
  },
  {
    title: "Updating Kali and Installing Tools", focus: "System care", time: "45 min",
    objectives: ["Explain repositories and APT", "Run a safe update routine", "Install and remove packages", "Check installed tool versions"],
    explanation: [
      "APT retrieves signed package information and software from configured repositories. `apt update` refreshes package lists; `apt upgrade` installs available upgrades. Use official Kali repositories and review changes before accepting them outside this guided lab.",
      "Installing a small group of standard utilities demonstrates package management without running unknown scripts."
    ],
    steps: ["Create a VM snapshot before a large upgrade.", "Refresh package information.", "Upgrade installed packages.", "Install the listed utilities.", "Verify each version.", "Remove no-longer-needed dependencies."],
    commands: `sudo apt update\nsudo apt upgrade -y\nsudo apt install -y curl wget git nano tree\ncurl --version\nwget --version\ngit --version\ntree --version\nsudo apt autoremove -y`,
    expected: "APT downloads repository metadata and approved packages. Version commands print each installed program's release information. `autoremove` proposes dependencies no longer needed; read its list before confirming in normal use.",
    mistakes: ["Running random `curl | bash` installers", "Interrupting package configuration", "Mixing unsupported repositories", "Upgrading without sufficient disk space"],
    takeaway: "Use trusted repositories, understand each installation command, and keep recoverable snapshots.",
    safety: "Avoid running random install scripts from the internet without understanding and verifying them.",
    troubleshooting: ["Use `sudo apt --fix-broken install` to ask APT to repair dependency issues.", "Use `sudo dpkg --configure -a` to finish interrupted package configuration."],
    quiz: [["What does `apt update` refresh?", ["Package lists", "User passwords", "Network routes"], 0], ["Where should Kali packages come from?", ["Configured trusted repositories", "Any pasted script", "Unknown file shares"], 0], ["Why snapshot before major updates?", ["To restore if the VM breaks", "To hide changes", "To scan faster"], 0]]
  },
  {
    title: "Introduction to Nmap", focus: "Discovery", time: "60 min",
    objectives: ["Explain Nmap's defensive and testing role", "Distinguish host discovery from port scanning", "Identify ports and services", "Run limited scans against localhost or an authorized VM"],
    explanation: [
      "Nmap is a network discovery and service-enumeration utility used by administrators, defenders, and authorized testers. Host discovery asks whether a device appears reachable; port scanning checks which network ports respond; service detection attempts to identify the software behind an open port.",
      "A port is a numbered network endpoint. A service is the program listening there. An open port is not automatically a vulnerability and must be interpreted in context."
    ],
    steps: ["Confirm your Kali address.", "Scan localhost first.", "Compare a basic scan with service detection.", "Optionally inspect OS detection on your own VM; elevated privileges may be requested.", "Only if you own an isolated vulnerable VM, substitute its host-only address for `LAB_TARGET_IP`."],
    commands: `ip a\nhostname -I\nnmap 127.0.0.1\nnmap -sV 127.0.0.1\nsudo nmap -O 127.0.0.1\n\n# Authorized local vulnerable VM only:\nnmap LAB_TARGET_IP\nnmap -sV LAB_TARGET_IP\nnmap -Pn LAB_TARGET_IP`,
    expected: "Localhost results may show no open ports or only services you started. `-sV` adds service/version guesses. `-O` attempts OS identification and may be inconclusive on localhost. `-Pn` skips initial host discovery for your authorized lab target; it does not grant permission.",
    mistakes: ["Scanning public websites or address ranges", "Assuming every open port is exploitable", "Using a target address without verifying ownership and scope"],
    takeaway: "Nmap helps you inventory authorized systems; scope and interpretation matter more than the number of commands.",
    safety: "Use Nmap only on your own Kali VM, your own authorized lab device, or an intentionally vulnerable local VM. No public targets.",
    quiz: [["What does `-sV` request?", ["Service detection", "Stealth", "Password recovery"], 0], ["Is an open port automatically a vulnerability?", ["No", "Yes, always", "Only on Linux"], 0], ["What may replace LAB_TARGET_IP?", ["Only an owned or explicitly authorized lab VM IP", "Any public website", "A random local device"], 0]]
  },
  {
    title: "Introduction to Web Security Testing Tools", focus: "Web labs", time: "55 min",
    objectives: ["Describe HTTP requests and responses", "Recognize GET, POST, status codes, cookies, and forms", "Identify safe web-testing tools", "Start and inspect a local test server"],
    explanation: [
      "Web security testing examines how an application receives input, manages sessions, and returns content. A request contains a method such as GET or POST, a path, headers, and sometimes a body. A response contains a status code, headers, and content.",
      "Browser developer tools inspect your own browser traffic. Burp Suite Community and OWASP ZAP can proxy authorized lab traffic. Nikto performs checks and must be restricted to your own local lab. Deliberately vulnerable platforms such as DVWA and OWASP Juice Shop exist for legal practice."
    ],
    steps: ["Create or enter a harmless practice folder.", "Start Python's simple local web server.", "Open the loopback URL in your browser.", "Use curl to view the body and headers.", "Stop the server with Ctrl+C when finished."],
    commands: `mkdir -p ~/digitalmizzle-lab/web-demo\ncd ~/digitalmizzle-lab/web-demo\necho "DigitalMizzle local lab" > index.html\npython3 -m http.server 8080\n\n# In a second terminal:\ncurl http://127.0.0.1:8080\ncurl -I http://127.0.0.1:8080`,
    expected: "The server terminal reports that it is serving on port 8080. Opening `http://127.0.0.1:8080` displays the local file. The first curl command prints content; `curl -I` prints response headers, commonly including status `200 OK`.",
    mistakes: ["Pointing tools at a real website", "Binding vulnerable apps to exposed interfaces", "Leaving a practice server running unnecessarily"],
    takeaway: "Learn HTTP by observing a harmless local server before working with deliberately vulnerable lab applications.",
    safety: "Only test local applications you own, such as your own server, DVWA, or OWASP Juice Shop in an isolated lab. No exploit payloads are needed here.",
    quiz: [["Which address keeps the test local?", ["127.0.0.1", "A public domain", "A random IP"], 0], ["What does `curl -I` request?", ["Response headers", "Passwords", "Database contents"], 0], ["Which tools require explicit authorization?", ["All web security testing tools", "Only paid tools", "None in Kali"], 0]]
  },
  {
    title: "Building a Safe Practice Lab", focus: "Environment", time: "50 min",
    objectives: ["Design an isolated beginner lab", "Use snapshots and controlled network modes", "Maintain a lab journal", "Verify authorization before each exercise"],
    explanation: [
      "A safe beginner lab contains a Kali VM and one intentionally vulnerable target VM. Place both on a host-only network for testing. Temporarily use NAT only when a VM needs trusted updates, and never expose the vulnerable target directly to the internet.",
      "Snapshots provide recovery points. A lab journal records date, scope, addresses, actions, and observations so practice becomes repeatable and professional."
    ],
    steps: ["Create clean snapshots for both VMs.", "Set their testing adapters to the same host-only network.", "Confirm the vulnerable VM has no bridged adapter.", "Create a notes directory in Kali.", "Record the date and Kali lab address.", "Complete the authorization checklist before testing."],
    commands: `mkdir -p ~/digitalmizzle-lab/notes\ncd ~/digitalmizzle-lab/notes\nnano lab-journal.txt\nip a\ndate >> lab-journal.txt\nhostname -I >> lab-journal.txt\ncat lab-journal.txt`,
    expected: "The notes directory and journal are created. After saving and exiting Nano, the date and Kali address are appended. `cat` displays the journal so you can confirm the record.",
    mistakes: ["Leaving a vulnerable VM bridged", "Testing before checking the target address", "Making major changes without snapshots", "Failing to document scope"],
    takeaway: "Isolation, recoverability, authorization, and documentation are the four foundations of a safe lab.",
    safety: "Checklist: snapshots created; network mode checked; target owned or authorized; notes maintained; no public targets used.",
    quiz: [["Which network should connect Kali and a vulnerable VM for isolated practice?", ["Host-only", "Bridged", "Public hotspot"], 0], ["When is NAT useful?", ["Trusted updates", "Exposing vulnerable services", "Scanning public systems"], 0], ["What should a lab journal record?", ["Scope and observations", "Other people's credentials", "Methods to hide activity"], 0]]
  },
  {
    title: "Final Checklist and Next Steps", focus: "Review", time: "45 min",
    objectives: ["Review core Kali and Linux skills", "Validate system and network information", "Perform a safe update check", "Complete a localhost Nmap review"],
    explanation: [
      "You have learned Kali orientation, virtualization, terminal navigation, file permissions, networking, package care, safe Nmap use, local web inspection, and isolated lab design.",
      "You are beginner-ready when you can explain the purpose of a command before running it, verify the current target and network mode, keep notes, restore snapshots, and stop when authorization is unclear."
    ],
    steps: ["Create the final-check folder.", "Record your user, hostname, kernel, address, disk, and memory information.", "Refresh trusted package lists.", "Run a safe localhost scan.", "Read your generated system report.", "Choose a next course."],
    commands: `mkdir -p ~/digitalmizzle-final-check\ncd ~/digitalmizzle-final-check\nwhoami > system-check.txt\nhostname >> system-check.txt\nuname -a >> system-check.txt\nhostname -I >> system-check.txt\ndf -h >> system-check.txt\nfree -h >> system-check.txt\nsudo apt update\nnmap 127.0.0.1\ncat system-check.txt`,
    expected: "`system-check.txt` contains your own VM identity, kernel, local address, disk, and memory details. APT refreshes package metadata. Nmap inspects only localhost. The final `cat` command displays your collected report.",
    mistakes: ["Substituting a public target for localhost", "Skipping output review", "Moving to advanced topics without understanding scope and lab isolation"],
    takeaway: "Congratulations! You have completed Kali Linux Foundations by DigitalMizzle. You are ready to continue with safe, legal, hands-on cybersecurity labs.",
    safety: "Recommended next courses: Linux for Cybersecurity; Networking for Ethical Hackers; Nmap Essentials; Web Security Lab Basics; SIEM and IDS/IPS Fundamentals.",
    quiz: [["What target is used in the final Nmap check?", ["127.0.0.1", "A public website", "An unknown router"], 0], ["What should happen when authorization is unclear?", ["Stop and clarify scope", "Continue quietly", "Change tools"], 0], ["What is the best next step?", ["Continue structured authorized labs", "Attack public systems", "Disable documentation"], 0]]
  }
];

const levelProfiles = [
  {
    intermediate: {
      time: "50 min",
      objectives: ["Explain Kali's Debian base and rolling release model", "Separate platform capability from authorization", "Inspect system identity for support and audit records", "Create a repeatable session-start workflow"],
      explanation: ["At an intermediate level, treat Kali as a managed assessment workstation. Its rolling repositories and preinstalled tool categories reduce setup time, but also require deliberate updates, snapshots, and evidence notes.", "A professional workflow begins by recording operator, host, release, kernel, working directory, and time. This context helps reproduce results and distinguish tool behavior from environment changes."],
      steps: ["Create a session evidence directory.", "Capture system identity into a dated file.", "Review the record before beginning any lab work.", "Note the authorized scope and VM snapshot name in the same directory."],
      commands: `mkdir -p ~/digitalmizzle-lab/evidence\ncd ~/digitalmizzle-lab/evidence\nwhoami | tee session-context.txt\nhostname | tee -a session-context.txt\nuname -a | tee -a session-context.txt\ncat /etc/os-release | tee -a session-context.txt\ndate --iso-8601=seconds | tee -a session-context.txt`,
      expected: "A single `session-context.txt` file records identity, host, kernel, Kali release, and an ISO-formatted timestamp. `tee -a` both displays and appends output.",
      troubleshooting: ["If a command is unavailable, use the equivalent from the Beginner profile and document the difference.", "If time is incorrect, fix the VM clock before collecting evidence."],
      mistakes: ["Treating tool availability as authority to use it", "Updating the VM in the middle of a reproducibility-sensitive exercise", "Failing to record the starting environment"],
      takeaway: "Kali is most useful when it is operated as a controlled, documented security workstation.",
      quiz: [["Why capture release and kernel data?", ["For reproducibility and support context", "To bypass controls", "To discover passwords"], 0], ["What does `tee -a` do?", ["Displays and appends output", "Deletes a file", "Changes ownership"], 0], ["What must precede testing?", ["Confirmed authorization and scope", "A public target", "Stealth configuration"], 0]]
    },
    advanced: {
      time: "65 min",
      objectives: ["Baseline an assessment workstation", "Validate release, kernel, clock, and repository context", "Apply evidence integrity habits", "Document operational scope before activity"],
      explanation: ["Advanced operators treat the workstation as part of the evidence chain. Tool versions, repository state, clock accuracy, locale, and environment variables can affect output and must be recorded when findings need review.", "A defensible session record identifies operator context without collecting secrets. Hashing the record provides a simple integrity reference for later comparison; it is not a substitute for a formal evidence process."],
      steps: ["Create a restricted evidence directory.", "Collect non-sensitive workstation metadata.", "Hash the resulting record.", "Add scope, authorization reference, and snapshot identifier manually.", "Keep the record with exported tool output."],
      commands: `install -d -m 700 ~/digitalmizzle-lab/evidence\ncd ~/digitalmizzle-lab/evidence\n{\n  id\n  hostnamectl\n  uname -a\n  cat /etc/os-release\n  timedatectl status\n  locale\n} | tee workstation-baseline.txt\nsha256sum workstation-baseline.txt | tee workstation-baseline.sha256`,
      expected: "The directory is owner-only, the baseline contains operational metadata, and the SHA-256 file records an integrity value. Review the output to ensure no sensitive environment data was captured.",
      troubleshooting: ["If `hostnamectl` is unavailable in a minimal VM, record `hostname` and `/etc/hostname` instead.", "If clock synchronization is inactive, correct it before time-sensitive lab capture."],
      mistakes: ["Capturing tokens or secret environment variables", "Claiming a hash proves who created evidence", "Changing the workstation after baselining without recording the change"],
      takeaway: "Professional Kali use starts with scope, controlled state, and evidence that another analyst can understand.",
      quiz: [["What does hashing the baseline provide?", ["An integrity comparison value", "Authorization", "Encryption"], 0], ["Why record clock status?", ["Timestamps matter during correlation", "It opens ports", "It changes permissions"], 0], ["What belongs in the scope note?", ["Authorized systems and boundaries", "Unrelated public targets", "Credentials from others"], 0]]
    }
  },
  {
    intermediate: {
      time: "70 min",
      objectives: ["Compare NAT, host-only, and bridged behavior", "Validate guest resources and adapters", "Create recovery checkpoints", "Troubleshoot VM integration"],
      explanation: ["Intermediate lab design commonly uses two adapters on Kali: NAT for trusted updates and host-only for isolated lab communication. Vulnerable targets should normally have host-only only.", "Resource sizing should leave the host stable. Validate assigned CPU, memory, disk, route, and DNS from inside the guest rather than relying only on hypervisor settings."],
      steps: ["Record the VM's adapter modes.", "Validate CPU and memory allocation from Kali.", "Confirm the default route uses the NAT adapter.", "Confirm the host-only interface has no public route.", "Create a post-update snapshot."],
      commands: `lscpu | grep -E '^CPU\\(s\\)|Model name'\nfree -h\ndf -h /\nip -brief address\nip route\nresolvectl status 2>/dev/null || cat /etc/resolv.conf\nping -c 4 8.8.8.8\ngetent hosts kali.org`,
      expected: "The output confirms guest resources, concise interface addresses, a default route for internet access, resolver information, and successful numeric and DNS lookups.",
      troubleshooting: ["No default route: verify NAT adapter connection and DHCP.", "DNS failure with successful numeric ping: inspect resolver configuration.", "Poor performance: reduce competing host load and verify hardware virtualization."],
      mistakes: ["Giving the vulnerable VM NAT access permanently", "Using overlapping host-only subnets", "Taking snapshots while package configuration is incomplete"],
      takeaway: "Validate isolation from inside every VM; a diagram and a snapshot are part of the lab build.",
      quiz: [["Which VM usually needs host-only only?", ["The vulnerable target", "Every internet service", "The physical router"], 0], ["What does `ip -brief address` provide?", ["Concise interface state", "Disk usage", "Package versions"], 0], ["Why preserve a post-update snapshot?", ["For a clean recoverable baseline", "To expose the VM", "To replace authorization"], 0]]
    },
    advanced: {
      time: "85 min",
      objectives: ["Design segmented lab adapters", "Validate routes and exposure", "Record hypervisor-independent guest evidence", "Test recovery procedure"],
      explanation: ["Advanced lab assurance verifies not only connectivity but the absence of unintended routes. Each vulnerable guest should have a documented interface purpose and no path to production networks.", "Snapshot strategy should include naming, purpose, dependency state, and a tested restore. A snapshot is operational convenience, not a backup of critical data."],
      steps: ["Create an adapter inventory and intended data-flow diagram.", "Capture addresses, routes, listening sockets, and resolver state.", "Verify the vulnerable segment has no default route.", "Restore a disposable snapshot and confirm expected state.", "Record validation results."],
      commands: `mkdir -p ~/digitalmizzle-lab/evidence\n{\n  ip -details -brief link\n  ip -brief address\n  ip route show table all\n  ss -tulpen\n  cat /etc/resolv.conf\n} | tee ~/digitalmizzle-lab/evidence/network-baseline.txt\nsha256sum ~/digitalmizzle-lab/evidence/network-baseline.txt`,
      expected: "The evidence file documents link state, all addresses and routes, listening services, and resolver configuration. Analysts should verify that only intended interfaces and routes exist.",
      troubleshooting: ["Unexpected route: disconnect the adapter in the hypervisor and revalidate.", "Unexpected listener: identify its owning process before deciding whether it belongs in the baseline."],
      mistakes: ["Assuming host-only labels guarantee isolation", "Leaving port forwarding enabled", "Using snapshots as the only copy of important notes"],
      takeaway: "A secure lab is demonstrated through routing and exposure evidence, not assumed from UI settings.",
      quiz: [["What proves isolation most directly?", ["Validated routes and adapters", "The VM name", "A desktop wallpaper"], 0], ["Is a snapshot a full backup strategy?", ["No", "Always", "Only on Kali"], 0], ["Why record listening sockets?", ["To baseline guest exposure", "To exploit them", "To hide services"], 0]]
    }
  },
  {
    intermediate: {
      time: "65 min",
      objectives: ["Use paths, redirection, pipes, and command chaining", "Search command history safely", "Inspect file types and command locations", "Build repeatable shell workflows"],
      explanation: ["Intermediate shell use combines small commands. Pipes send one command's output to another; redirection writes output to files; `&&` runs the next command only after success.", "Before trusting a command, locate its executable and read its help. Quote paths containing spaces and use tab completion to reduce typing errors."],
      steps: ["Create a structured practice directory.", "Generate a small system report using pipes and redirection.", "Inspect command locations and file types.", "Search history for your own lab commands."],
      commands: `mkdir -p ~/digitalmizzle-lab/terminal/{notes,output}\ncd ~/digitalmizzle-lab/terminal\nprintf "DigitalMizzle\\nKali Lab\\n" | tee notes/session.txt\nwc -l notes/session.txt\nfile notes/session.txt\ncommand -v ls\nhistory | grep -i digitalmizzle\nfind . -maxdepth 2 -type f -print`,
      expected: "Directories are created in one operation, `tee` writes and displays two lines, `wc -l` reports two lines, and `find` lists the practice file.",
      troubleshooting: ["Unexpected brace text: verify you are using Bash or Zsh with brace expansion.", "No history match: run a command containing the search term first."],
      mistakes: ["Overwriting a file with `>` when append `>>` was intended", "Piping sensitive output into world-readable locations", "Using complex one-liners without testing each stage"],
      takeaway: "Compose commands gradually, validate each stage, and preserve useful output in a predictable workspace.",
      quiz: [["What does a pipe do?", ["Passes output to another command", "Changes users", "Creates a network route"], 0], ["What does `&&` indicate?", ["Run next command after success", "Run as root", "Append output"], 0], ["Why use `command -v`?", ["Locate the command executable", "Scan a host", "Change permissions"], 0]]
    },
    advanced: {
      time: "80 min",
      objectives: ["Build auditable shell pipelines", "Control error handling", "Capture stdout and stderr separately", "Validate command provenance"],
      explanation: ["Advanced shell work prioritizes predictable failure behavior and evidence capture. Pipelines can hide failures unless their status is checked, and mixed output can make troubleshooting difficult.", "Use a small script with strict options for repeatable lab administration. Read every line and keep it scoped to non-destructive inventory tasks."],
      steps: ["Create a safe inventory script.", "Enable strict Bash error behavior.", "Capture normal output and errors separately.", "Review exit status and generated artifacts.", "Hash the final report."],
      commands: `cat > ~/digitalmizzle-lab/terminal-audit.sh <<'SCRIPT'\n#!/usr/bin/env bash\nset -euo pipefail\nprintf 'Operator: %s\\n' \"$(id -un)\"\nprintf 'Host: %s\\n' \"$(hostname)\"\nprintf 'Kernel: %s\\n' \"$(uname -r)\"\nip -brief address\nSCRIPT\nchmod 700 ~/digitalmizzle-lab/terminal-audit.sh\n~/digitalmizzle-lab/terminal-audit.sh > ~/digitalmizzle-lab/terminal-audit.txt 2> ~/digitalmizzle-lab/terminal-audit.err\nsha256sum ~/digitalmizzle-lab/terminal-audit.txt`,
      expected: "The owner-executable script creates a normal report, a separate error file, and a hash. An empty error file is expected when all inventory commands succeed.",
      troubleshooting: ["Non-zero exit: inspect the error file before changing the script.", "Missing command: locate it with `command -v` and document the dependency."],
      mistakes: ["Running downloaded scripts without review", "Using strict mode in an untested destructive script", "Ignoring stderr or pipeline exit status"],
      takeaway: "Professional shell automation is readable, bounded, error-aware, and produces reviewable artifacts.",
      quiz: [["What does `set -euo pipefail` improve?", ["Failure visibility", "Network stealth", "Password access"], 0], ["Why separate stderr?", ["To troubleshoot errors clearly", "To erase evidence", "To elevate privileges"], 0], ["What permission does 700 give?", ["Owner full access only", "Everyone full access", "Read-only for all"], 0]]
    }
  },
  {
    intermediate: {
      time: "70 min",
      objectives: ["Interpret symbolic and numeric permissions", "Inspect ownership and groups", "Use default permission masks", "Apply least privilege in a lab workspace"],
      explanation: ["Permissions combine owner, group, and other access. Directory execute permission controls traversal, while file execute permission controls whether a file can run.", "The `umask` subtracts permissions from defaults. Intermediate operators verify ownership and effective access before using `chmod` or `chown`."],
      steps: ["Create a shared-style practice directory without touching system paths.", "Inspect the current umask.", "Create files under controlled permissions.", "Compare symbolic and numeric output.", "Verify effective identity and groups."],
      commands: `mkdir -p ~/digitalmizzle-lab/permissions/intermediate\ncd ~/digitalmizzle-lab/permissions/intermediate\numask\numask 027\ntouch private-notes.txt\nmkdir reports\nls -ld . reports private-notes.txt\nstat -c '%A %a %U:%G %n' private-notes.txt reports\nchmod u=rw,go= private-notes.txt\nid`,
      expected: "With umask 027, new files generally deny access to others. `stat` shows symbolic mode, numeric mode, owner, group, and name. The final file is owner read/write only.",
      troubleshooting: ["Unexpected mode: remember existing files are not changed by a new umask.", "Permission denied: inspect parent-directory traversal permissions."],
      mistakes: ["Using 777 to solve access problems", "Changing ownership without understanding service needs", "Confusing directory read and execute behavior"],
      takeaway: "Use the narrowest permissions that support the intended workflow and verify effective access.",
      quiz: [["What does directory execute permission allow?", ["Traversal", "Automatic deletion", "Network access"], 0], ["Is 777 a good default fix?", ["No", "Yes", "Only for logs"], 0], ["What does umask influence?", ["Default permissions for new objects", "IP addresses", "Package sources"], 0]]
    },
    advanced: {
      time: "85 min",
      objectives: ["Audit permissions and ownership", "Identify risky writable paths", "Use ACL inspection", "Document least-privilege findings"],
      explanation: ["Advanced permission review considers traditional mode bits, ownership, ACLs, setuid/setgid bits, and writable-path exposure. This module limits inspection to the learner's own lab workspace.", "A finding should state the observed permission, affected path, intended use, risk, and recommended least-privilege correction."],
      steps: ["Build a small permission test tree.", "Apply controlled group-style permissions.", "Inspect ACL and mode data.", "Search only your lab tree for world-writable objects.", "Write a short remediation note."],
      commands: `mkdir -p ~/digitalmizzle-lab/permission-audit/{private,shared}\nchmod 700 ~/digitalmizzle-lab/permission-audit/private\nchmod 770 ~/digitalmizzle-lab/permission-audit/shared\ngetfacl -p ~/digitalmizzle-lab/permission-audit 2>/dev/null || true\nfind ~/digitalmizzle-lab/permission-audit -xdev -perm -0002 -printf '%M %u:%g %p\\n'\nstat -c '%A %a %U:%G %n' ~/digitalmizzle-lab/permission-audit/*`,
      expected: "The private and shared directories show distinct least-privilege modes. The scoped `find` should return nothing unless a world-writable object exists in the lab tree.",
      troubleshooting: ["Missing `getfacl`: install the `acl` package from trusted repositories.", "Unexpected writable result: inspect why it exists before correcting it."],
      mistakes: ["Auditing the entire system without scope", "Removing permissions before understanding application impact", "Ignoring ACLs because mode bits look correct"],
      takeaway: "Permission audits combine observation, business intent, impact analysis, and a measured remediation.",
      quiz: [["Why scope `find` to the lab tree?", ["To keep the exercise bounded and relevant", "To evade monitoring", "To access more files"], 0], ["What can ACLs add?", ["Permissions beyond basic mode bits", "Network routes", "Package signatures"], 0], ["What belongs in a finding?", ["Observation, impact, and remediation", "Only a command", "Unrelated secrets"], 0]]
    }
  },
  {
    intermediate: {
      time: "70 min",
      objectives: ["Correlate address, route, DNS, and socket data", "Distinguish interface scopes", "Validate connectivity methodically", "Capture a reusable network baseline"],
      explanation: ["Intermediate troubleshooting moves through layers: interface state, address, route, gateway reachability, external routing, DNS resolution, and local listeners.", "Interface metrics and multiple adapters can affect route selection. Record evidence before changing settings so the original fault remains understandable."],
      steps: ["Capture interface and route state.", "Identify the selected route for a harmless public resolver address without scanning it.", "Test loopback and DNS lookup.", "Record local listeners and owning processes."],
      commands: `mkdir -p ~/digitalmizzle-lab/evidence\nip -brief address | tee ~/digitalmizzle-lab/evidence/interfaces.txt\nip route | tee ~/digitalmizzle-lab/evidence/routes.txt\nip route get 8.8.8.8\nping -c 4 127.0.0.1\ngetent hosts google.com\nss -tulpen | tee ~/digitalmizzle-lab/evidence/listeners.txt`,
      expected: "The route lookup shows which local interface and gateway Kali would use; it does not scan the destination. `getent` confirms resolver behavior, and the socket report maps local listeners to processes when permitted.",
      troubleshooting: ["No route: inspect adapter state and DHCP.", "DNS lookup fails: compare `/etc/resolv.conf` with the active network service.", "Listener lacks process data: rerun only the local socket command with sudo if necessary."],
      mistakes: ["Changing several network settings at once", "Confusing route lookup with target authorization", "Assuming DNS failure means total internet failure"],
      takeaway: "Collect a baseline, isolate the failing layer, make one change, and validate again.",
      quiz: [["What does `ip route get` show?", ["Local route selection", "Remote vulnerabilities", "DNS cache passwords"], 0], ["Why capture state before changes?", ["To preserve troubleshooting context", "To hide the issue", "To increase privileges"], 0], ["What maps names through configured resolution?", ["getent hosts", "chmod", "df"], 0]]
    },
    advanced: {
      time: "90 min",
      objectives: ["Analyze routing and neighbor state", "Validate local exposure defensively", "Capture packet metadata on loopback", "Produce a network audit artifact"],
      explanation: ["Advanced network validation correlates routes, neighbors, sockets, and controlled packet capture. This exercise captures only loopback traffic generated by the learner.", "A defensive audit notes expected interfaces and services, deviations, evidence timestamps, and ownership. Packet capture can contain sensitive data, so scope and storage controls matter."],
      steps: ["Record routes, rules, and neighbor state.", "Start a short loopback-only packet capture.", "Generate four loopback pings.", "Inspect the capture summary.", "Hash and retain the audit artifacts."],
      commands: `mkdir -p ~/digitalmizzle-lab/network-audit\ncd ~/digitalmizzle-lab/network-audit\nip rule show | tee rules.txt\nip route show table all | tee routes-all.txt\nip neigh show | tee neighbors.txt\nsudo timeout 8 tcpdump -i lo -c 8 -w loopback.pcap &\nping -c 4 127.0.0.1\nwait\ntcpdump -nn -r loopback.pcap\nsha256sum *.txt loopback.pcap | tee SHA256SUMS`,
      expected: "The capture contains only local loopback packets generated during the exercise. Text artifacts document policy routing and neighbor state, and hashes support later integrity comparison.",
      troubleshooting: ["No capture packets: ensure the capture started before ping and the interface is `lo`.", "Permission error: packet capture requires authorized sudo access on your VM."],
      mistakes: ["Capturing on broad interfaces without need", "Retaining sensitive packet data carelessly", "Interpreting neighbor entries as vulnerabilities"],
      takeaway: "Advanced network evidence is narrowly scoped, timestamped, reviewable, and protected like any other sensitive artifact.",
      quiz: [["Why capture only loopback here?", ["To keep collection safe and bounded", "To discover public hosts", "To evade controls"], 0], ["What may a PCAP contain?", ["Sensitive traffic data", "Only filenames", "No metadata"], 0], ["What should an audit explain?", ["Expected state and deviations", "How to hide traffic", "Unrelated targets"], 0]]
    }
  },
  {
    intermediate: {
      time: "60 min",
      objectives: ["Inspect repository configuration", "Preview upgrade impact", "Validate package provenance", "Capture installed versions"],
      explanation: ["Intermediate package care reviews repository sources and upgrade plans before making changes. Package metadata and signatures help establish provenance.", "Use simulation where available to understand change scope, then capture relevant versions for reproducibility."],
      steps: ["Inspect enabled Kali sources.", "Refresh package lists.", "Simulate an upgrade and review the summary.", "Install approved utilities.", "Capture package policy and versions."],
      commands: `grep -Rhv '^#' /etc/apt/sources.list /etc/apt/sources.list.d 2>/dev/null\nsudo apt update\napt-get -s upgrade | less\nsudo apt install -y curl wget git nano tree\napt-cache policy curl git\n{\n  curl --version | head -n 1\n  wget --version | head -n 1\n  git --version\n  tree --version\n} | tee ~/digitalmizzle-lab/tool-versions.txt`,
      expected: "Repository lines should match trusted Kali configuration. Simulation lists proposed changes without installing them. Policy output shows candidate versions and source priorities.",
      troubleshooting: ["Unsigned repository warning: stop and verify source configuration.", "Held packages: inspect them rather than forcing replacement.", "Low disk: review `df -h` and clear only understood caches/files."],
      mistakes: ["Adding third-party repositories casually", "Using `-y` without reviewing impact", "Failing to record tool versions used in a lab"],
      takeaway: "Understand source, candidate version, and change impact before modifying a security workstation.",
      quiz: [["What does `apt-get -s upgrade` do?", ["Simulates an upgrade", "Deletes packages", "Scans a network"], 0], ["Why capture tool versions?", ["For reproducibility", "For stealth", "To grant access"], 0], ["What should an unsigned repository warning trigger?", ["Stop and investigate", "Ignore it", "Disable logs"], 0]]
    },
    advanced: {
      time: "80 min",
      objectives: ["Audit repository trust and package state", "Detect unexpected changes", "Validate installed package files", "Document workstation maintenance"],
      explanation: ["Advanced maintenance treats package state as part of workstation assurance. Repository files, held packages, pending upgrades, and package verification results should be understood before an assessment.", "Debian package verification can identify changed files, but changes may be legitimate configuration edits and require interpretation."],
      steps: ["Capture source and package-state evidence.", "List held and upgradable packages.", "Verify a small set of installed packages.", "Record versions and hash the report.", "Document any expected deviations."],
      commands: `mkdir -p ~/digitalmizzle-lab/package-audit\n{\n  grep -Rhv '^#' /etc/apt/sources.list /etc/apt/sources.list.d 2>/dev/null\n  apt-mark showhold\n  apt list --upgradable 2>/dev/null\n  dpkg-query -W -f='\${Package}\\t\${Version}\\n' curl wget git nano tree\n  dpkg --verify curl wget git 2>/dev/null\n} | tee ~/digitalmizzle-lab/package-audit/state.txt\nsha256sum ~/digitalmizzle-lab/package-audit/state.txt`,
      expected: "The report combines trusted sources, holds, pending upgrades, selected versions, and verification output. No verification output generally means no detected file differences for the selected packages.",
      troubleshooting: ["Verification difference: identify whether it is expected configuration change before remediation.", "Repository mismatch: restore official configuration from trusted documentation."],
      mistakes: ["Treating every verification difference as compromise", "Forcing package changes during active evidence collection", "Keeping undocumented third-party repositories"],
      takeaway: "A maintained assessment workstation has explainable repositories, versions, changes, and exceptions.",
      quiz: [["Does a verification difference always mean compromise?", ["No, it requires interpretation", "Yes", "Only on Kali"], 0], ["Why list held packages?", ["They affect update state", "They open ports", "They change DNS"], 0], ["When should major maintenance occur?", ["Before a controlled session or during planned change", "Mid-evidence capture without notes", "Against a target"], 0]]
    }
  },
  {
    intermediate: {
      time: "75 min",
      objectives: ["Validate an authorized target before scanning", "Use service detection purposefully", "Interpret states and confidence", "Save a lab scan record"],
      explanation: ["Intermediate Nmap use begins with scope validation. Confirm the target address from the vulnerable VM console, record why it is authorized, and verify it belongs to the host-only subnet.", "Service detection sends additional probes to open ports. `-Pn` skips host discovery and should be used only when the authorized lab target is known but does not answer discovery probes."],
      steps: ["Scan localhost first.", "Record the authorized lab target from its own console.", "Run service detection against localhost.", "If applicable, run a basic and `-Pn` scan against only the authorized lab VM.", "Save output for comparison."],
      commands: `mkdir -p ~/digitalmizzle-lab/nmap\nnmap -sV 127.0.0.1 | tee ~/digitalmizzle-lab/nmap/localhost-services.txt\n\n# Replace only with your owned, host-only lab VM address:\nnmap LAB_TARGET_IP\nnmap -Pn LAB_TARGET_IP`,
      expected: "The localhost record lists reachable local ports and service guesses. The lab target scans should reference exactly one authorized address. `-Pn` changes host-discovery behavior, not scan authorization.",
      troubleshooting: ["Host appears down: verify VM power, host-only subnet, and target address before considering `-Pn`.", "Unknown service: validate locally on the target rather than assuming the version guess is exact."],
      mistakes: ["Scanning a subnet instead of one approved host", "Treating service guesses as confirmed facts", "Using `-Pn` as a universal fix"],
      takeaway: "Validate scope first, choose the minimum scan needed, and preserve output with interpretation notes.",
      quiz: [["Why use `-sV`?", ["To identify likely services", "To crack passwords", "To evade logging"], 0], ["What should precede LAB_TARGET_IP use?", ["Console validation and authorization", "A search-engine result", "Guessing"], 0], ["Are Nmap service guesses infallible?", ["No", "Yes", "Only on localhost"], 0]]
    },
    advanced: {
      time: "95 min",
      objectives: ["Plan a bounded audit methodology", "Capture normal-format evidence", "Interpret service and OS confidence", "Write defensible findings"],
      explanation: ["Advanced Nmap work is methodology-driven: define one authorized asset, objective, timing, command, output format, and validation method. The safest useful example remains localhost.", "OS and service identification are probabilistic. Professionals corroborate results with configuration evidence from the owned system and distinguish observation from conclusion."],
      steps: ["Create an audit directory and scope note.", "Run a localhost service and OS identification scan.", "Save normal output directly from Nmap.", "Record command, timestamp, and limitations.", "Validate any detected local service from the Kali VM itself."],
      commands: `mkdir -p ~/digitalmizzle-lab/nmap-audit\ncd ~/digitalmizzle-lab/nmap-audit\nprintf 'Target: 127.0.0.1\\nScope: local Kali VM only\\n' > scope.txt\nsudo nmap -sV -O -oN nmap-localhost-results.txt 127.0.0.1\ndate --iso-8601=seconds | tee timestamp.txt\nsha256sum scope.txt nmap-localhost-results.txt timestamp.txt | tee SHA256SUMS`,
      expected: "Nmap writes a readable report containing port states, service guesses, and possibly limited OS information. Localhost OS detection may be inconclusive; record that limitation instead of overstating confidence.",
      troubleshooting: ["OS detection warning: localhost may not provide enough distinct ports; accept and document the limitation.", "Unexpected service: confirm the owning local process with `ss -tulpen` before writing a finding."],
      mistakes: ["Expanding scope because results are sparse", "Reporting guesses as verified vulnerabilities", "Failing to retain the exact command and output"],
      takeaway: "A professional scan is bounded, reproducible, corroborated, and documented with confidence and limitations.",
      quiz: [["What does `-oN` do?", ["Saves normal-format output", "Enables stealth", "Runs exploits"], 0], ["How should inconclusive OS detection be handled?", ["Document the limitation", "Invent a result", "Scan public hosts"], 0], ["What validates an unexpected local service?", ["Local process/configuration evidence", "Assumption", "A larger target range"], 0]]
    }
  },
  {
    intermediate: {
      time: "70 min",
      objectives: ["Inspect HTTP methods, headers, and content", "Use a local proxy-ready workflow", "Compare GET and HEAD behavior", "Record safe web observations"],
      explanation: ["Intermediate web analysis separates transport, request, response, session state, and application behavior. Status codes and headers provide context but are not vulnerabilities by themselves.", "Use browser developer tools, Burp Community, or ZAP only with the local server or an isolated training application. Configure scope before enabling interception."],
      steps: ["Create a local page and start the server.", "Inspect response headers and a verbose request.", "Save headers and content separately.", "Use browser developer tools to compare the same request.", "Stop the server after practice."],
      commands: `mkdir -p ~/digitalmizzle-lab/web-intermediate\ncd ~/digitalmizzle-lab/web-intermediate\nprintf '<h1>DigitalMizzle Lab</h1>\\n' > index.html\npython3 -m http.server 8080\n\n# In a second terminal:\ncurl -v http://127.0.0.1:8080/ -o response.html 2> request-trace.txt\ncurl -I http://127.0.0.1:8080/ | tee response-headers.txt`,
      expected: "The local server returns the page. `response.html` contains the body, `request-trace.txt` shows request/connection details, and `response-headers.txt` captures headers.",
      troubleshooting: ["Address in use: stop the earlier server or use another local port such as 8081.", "Proxy cannot connect: verify it points to the local URL and the server is running."],
      mistakes: ["Leaving proxy scope unrestricted", "Calling every unusual header a vulnerability", "Testing third-party sites without permission"],
      takeaway: "Capture the request and response, explain observable behavior, and avoid conclusions unsupported by evidence.",
      quiz: [["Where does curl `-v` diagnostic output go in this example?", ["request-trace.txt", "The public internet", "A password file"], 0], ["Is a status code alone a vulnerability?", ["No", "Always", "Only 200"], 0], ["What should proxy scope contain?", ["Only the authorized local lab", "All browsing", "Public targets"], 0]]
    },
    advanced: {
      time: "90 min",
      objectives: ["Build a local HTTP evidence set", "Analyze response metadata defensively", "Use hashing for artifact integrity", "Write findings with scope and limitations"],
      explanation: ["Advanced web review emphasizes reproducible transactions and defensive analysis. Header observations can inform hardening recommendations, but the application's context determines impact.", "This exercise uses only a local Python server. It demonstrates evidence capture, not exploitation, payload delivery, authentication bypass, or vulnerability scanning."],
      steps: ["Start a local server with a known document.", "Capture request trace, response headers, and body.", "Record listening process information.", "Hash all artifacts.", "Write an observation stating that the server is a local demonstration service."],
      commands: `mkdir -p ~/digitalmizzle-lab/web-audit && cd ~/digitalmizzle-lab/web-audit\nprintf '<!doctype html><title>Authorized Lab</title><h1>DigitalMizzle</h1>\\n' > index.html\npython3 -m http.server 8080 > server.log 2>&1 & echo $! > server.pid\nsleep 1\ncurl --fail --show-error --dump-header headers.txt --output body.html http://127.0.0.1:8080/\nss -ltnp '( sport = :8080 )' | tee listener.txt\nsha256sum index.html headers.txt body.html server.log listener.txt | tee SHA256SUMS\nkill \"$(cat server.pid)\"`,
      expected: "Artifacts contain the known page, headers, server log, and local listener evidence. The background server is stopped using its recorded PID after collection.",
      troubleshooting: ["Curl fails: inspect `server.log` and listener state.", "Kill reports no process: confirm whether the server exited and document that fact."],
      mistakes: ["Reusing the workflow against real sites", "Treating missing optional headers as critical without context", "Leaving local services running after collection"],
      takeaway: "Expert web testing begins with controlled scope, reproducible evidence, careful interpretation, and cleanup.",
      quiz: [["What is the target in this audit?", ["The learner's localhost server", "A public web app", "A third party"], 0], ["Why record the PID?", ["To manage and stop the exact local process", "To bypass authentication", "To scan faster"], 0], ["What should a finding include?", ["Evidence, context, impact, and limitation", "Only a tool name", "An exploit payload"], 0]]
    }
  },
  {
    intermediate: {
      time: "70 min",
      objectives: ["Create a lab inventory", "Validate segmentation before each session", "Use structured journals", "Manage snapshots deliberately"],
      explanation: ["Intermediate labs benefit from a simple asset register: VM name, purpose, adapter mode, address, snapshot, owner, and authorization basis.", "A preflight check prevents accidental testing on the wrong adapter or stale target address. Notes should separate commands, observations, conclusions, and next actions."],
      steps: ["Create inventory and journal templates.", "Record Kali and target details from each VM console.", "Verify the host-only subnet.", "Record snapshot names and current date.", "Complete the preflight checklist."],
      commands: `mkdir -p ~/digitalmizzle-lab/{notes,evidence}\ncd ~/digitalmizzle-lab/notes\nprintf 'VM | Purpose | Network | Address | Snapshot | Authorization\\n' > inventory.txt\nprintf '# Lab Journal\\n\\n## Scope\\n## Commands\\n## Observations\\n## Conclusions\\n## Next Actions\\n' > lab-journal.md\n{\n  date --iso-8601=seconds\n  hostname\n  hostname -I\n  ip route\n} | tee session-preflight.txt`,
      expected: "The templates create consistent places for asset and session information. The preflight captures current identity, address, and route for comparison with the intended design.",
      troubleshooting: ["Address differs from inventory: validate DHCP and the target console before proceeding.", "Unexpected default route on target: disconnect NAT and recheck."],
      mistakes: ["Using remembered addresses without console validation", "Combining observations and conclusions", "Keeping vulnerable targets online for convenience"],
      takeaway: "A usable lab is inventoried, preflighted, recoverable, and documented every session.",
      quiz: [["Why separate observations from conclusions?", ["To make reasoning reviewable", "To hide details", "To reduce authorization"], 0], ["What should identify the target address?", ["Its own console and inventory", "A guess", "A public scan"], 0], ["When should preflight happen?", ["Before each lab session", "After testing only", "Never"], 0]]
    },
    advanced: {
      time: "90 min",
      objectives: ["Define lab trust boundaries", "Audit route and service exposure", "Establish evidence retention rules", "Test recovery and cleanup"],
      explanation: ["Advanced lab governance treats even training systems as managed assets. Define trust zones, allowed flows, update windows, evidence locations, and teardown conditions.", "Validation should include positive checks for intended communication and negative checks for unintended default routes or exposed listeners. Use only your own VM evidence."],
      steps: ["Write a one-page lab rules-of-engagement file.", "Capture Kali network and local service baseline.", "Confirm the vulnerable target has no internet route from its console.", "Test snapshot restore on disposable state.", "Archive notes with hashes and remove temporary services."],
      commands: `mkdir -p ~/digitalmizzle-lab/governance\ncd ~/digitalmizzle-lab/governance\nprintf 'Scope: owned local VMs only\\nAllowed network: host-only\\nPublic targets: prohibited\\n' > rules-of-engagement.txt\n{\n  date --iso-8601=seconds\n  ip -brief address\n  ip route show table all\n  ss -tulpen\n} | tee kali-baseline.txt\nsha256sum rules-of-engagement.txt kali-baseline.txt | tee SHA256SUMS`,
      expected: "The governance folder records explicit scope and a Kali baseline. Review routes and listeners against the intended design and document exceptions.",
      troubleshooting: ["Unexpected exposure: stop the session, disconnect the adapter, and investigate.", "Hash mismatch later: preserve both copies and determine whether an authorized edit occurred."],
      mistakes: ["Treating a home lab as risk-free", "Failing to define retention for packet captures or logs", "Restoring snapshots without preserving needed notes"],
      takeaway: "Professional lab maturity combines technical isolation with written rules, evidence handling, recovery, and cleanup.",
      quiz: [["What is a negative validation check?", ["Confirming an unintended route is absent", "Scanning public networks", "Disabling logs"], 0], ["Why define retention?", ["Lab evidence may contain sensitive data", "To avoid documentation", "To grant access"], 0], ["What should happen on unexpected exposure?", ["Stop and investigate", "Continue testing", "Hide the adapter"], 0]]
    }
  },
  {
    intermediate: {
      time: "65 min",
      objectives: ["Integrate system, network, package, and scan checks", "Produce a structured completion report", "Identify remaining skill gaps", "Select the next safe learning path"],
      explanation: ["The intermediate final exercise combines earlier workflows into a concise health and evidence report. The goal is not command volume; it is correct sequencing and interpretation.", "Review every generated artifact and add a short note describing expected state, observed state, and any follow-up."],
      steps: ["Create a timestamped final directory.", "Capture system and network baselines.", "Check package metadata without forcing an upgrade.", "Run a localhost service scan.", "Hash the evidence and write a review note."],
      commands: `work=~/digitalmizzle-final-$(date +%Y%m%d)\nmkdir -p "$work" && cd "$work"\n{\n  id\n  hostnamectl\n  uname -a\n  free -h\n  df -h /\n  ip -brief address\n  ip route\n} | tee system-network.txt\nsudo apt update |& tee apt-update.txt\nnmap -sV -oN nmap-localhost.txt 127.0.0.1\nsha256sum *.txt | tee SHA256SUMS`,
      expected: "The dated folder contains system/network evidence, package-update output, a localhost service report, and hashes. Review warnings rather than treating command completion as proof of health.",
      troubleshooting: ["APT warning: investigate repository or connectivity state.", "Unexpected Nmap listener: correlate with `ss -tulpen` locally."],
      mistakes: ["Running the checklist without reading output", "Changing scope during the final challenge", "Skipping written interpretation"],
      takeaway: "Intermediate readiness means you can execute, validate, troubleshoot, and explain a safe lab workflow.",
      quiz: [["What follows artifact creation?", ["Review and interpretation", "Public scanning", "Deleting evidence"], 0], ["Why use a dated folder?", ["To organize sessions", "To bypass permissions", "To change DNS"], 0], ["What should an unexpected listener trigger?", ["Local validation", "Immediate exploit attempts", "A public scan"], 0]]
    },
    advanced: {
      time: "95 min",
      objectives: ["Run a bounded workstation assurance review", "Correlate multiple evidence sources", "Document confidence and limitations", "Produce an executive and technical summary"],
      explanation: ["The advanced capstone simulates a small internal assurance review of the learner's own Kali VM. It combines scope, baseline, package state, local exposure, and integrity artifacts.", "Professional reporting distinguishes facts, analyst interpretation, residual uncertainty, and recommended action. A clean result still documents what was tested and what was not."],
      steps: ["Write scope and methodology.", "Collect workstation, route, listener, and package evidence.", "Run and save a localhost Nmap report.", "Hash artifacts.", "Write a short executive summary and technical observations with limitations."],
      commands: `work=~/digitalmizzle-capstone-$(date +%Y%m%d-%H%M%S)\ninstall -d -m 700 "$work" && cd "$work"\nprintf 'Scope: local Kali VM (127.0.0.1) only\\nMethod: configuration and localhost exposure review\\n' > scope.txt\n{\n  date --iso-8601=seconds\n  id\n  hostnamectl\n  uname -a\n  ip -brief address\n  ip route show table all\n  ss -tulpen\n  apt-mark showhold\n} | tee baseline.txt\nsudo nmap -sV -O -oN nmap-localhost.txt 127.0.0.1\nsha256sum scope.txt baseline.txt nmap-localhost.txt | tee SHA256SUMS\nprintf '# Executive Summary\\n\\n# Technical Observations\\n\\n# Limitations\\n' > report.md`,
      expected: "The restricted capstone directory contains scope, baseline, localhost scan, integrity list, and report template. OS detection may be limited; document this accurately.",
      troubleshooting: ["Permission prompt or missing data: document the limitation rather than broadening scope.", "Conflicting tool output: corroborate with local configuration and state the confidence level."],
      mistakes: ["Equating no open ports with complete security", "Omitting limitations", "Using technical jargon without explaining impact"],
      takeaway: "Advanced readiness is the ability to produce bounded, reproducible evidence and communicate what it does and does not prove.",
      quiz: [["What does a clean scan prove?", ["Only what was observed in the defined scope and time", "Complete security", "Authorization for more targets"], 0], ["Why include limitations?", ["To communicate uncertainty honestly", "To weaken evidence", "To hide methods"], 0], ["What should an executive summary emphasize?", ["Risk and outcome in clear language", "Every command flag", "Unrelated targets"], 0]]
    }
  }
];

const escapeHtml = (value) => value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
const list = (items, ordered = false) => `<${ordered ? "ol" : "ul"}>${items.map((item) => `<li>${item}</li>`).join("")}</${ordered ? "ol" : "ul"}>`;
const levelNames = { beginner: "Beginner", intermediate: "Intermediate", advanced: "Advanced" };
let selectedDifficulty = localStorage.getItem("dmzKaliDifficulty") || "beginner";
if (!levelNames[selectedDifficulty]) selectedDifficulty = "beginner";
let completed = new Set(JSON.parse(localStorage.getItem(`dmzKaliProgress-${selectedDifficulty}`) || "[]"));

function getLesson(index) {
  return selectedDifficulty === "beginner" ? lessons[index] : { ...lessons[index], ...levelProfiles[index][selectedDifficulty] };
}

function commandWalkthrough(commands) {
  if (selectedDifficulty !== "beginner") return "";
  const meanings = {
    whoami: "Shows the name of the account running the command.",
    hostname: "Shows the name assigned to this Kali VM.",
    uname: "Displays kernel and system architecture information.",
    lsb_release: "Displays Kali distribution release details.",
    pwd: "Prints the full path of your current directory.",
    date: "Shows the current system date and time.",
    ip: "Displays or inspects your VM's network configuration.",
    ping: "Sends a small connectivity test to the specified safe destination.",
    df: "Shows disk space in a readable format.",
    free: "Shows available and used memory.",
    sudo: "Runs this one command with approved administrator privileges.",
    ls: "Lists files; `-la` adds hidden files and details.",
    cd: "Changes the current directory.",
    clear: "Clears visible terminal text without deleting history.",
    history: "Displays commands used in the current shell history.",
    man: "Opens the manual for a command; press `q` to exit.",
    echo: "Prints text or writes it through redirection.",
    mkdir: "Creates a directory; `-p` also creates missing parent directories.",
    touch: "Creates an empty file or updates its timestamp.",
    cat: "Displays a text file's content.",
    cp: "Copies a file.",
    mv: "Moves or renames a file.",
    chmod: "Changes permissions on the named practice file.",
    id: "Shows your user ID and group memberships.",
    ss: "Lists local network sockets; these are services on your own VM.",
    curl: "Requests local web content or displays its version.",
    wget: "Retrieves content or displays its version in this exercise.",
    git: "Displays the installed Git version.",
    tree: "Displays folders in a tree layout or reports its version.",
    nmap: "Inspects only the explicitly named authorized local target.",
    python3: "Starts a simple web server for your local practice folder.",
    nano: "Opens a beginner-friendly terminal text editor."
  };
  const rows = commands.split("\n").map((line) => line.trim()).filter((line) => line && !line.startsWith("#") && !line.startsWith("http"));
  return `<div class="expected-box"><strong>What each command means</strong><ul>${rows.map((line) => {
    const normalized = line.replace(/^sudo\s+/, "").split(/\s+/)[0];
    return `<li><code>${escapeHtml(line)}</code>: ${meanings[normalized] || "Runs this step inside your own controlled Kali lab; review the expected output before continuing."}</li>`;
  }).join("")}</ul></div>`;
}

function renderQuiz(quiz, lessonIndex) {
  return quiz.map((question, questionIndex) => `
    <div class="quiz-question">
      <p>${questionIndex + 1}. ${question[0]}</p>
      <div class="quiz-options">${question[1].map((option, optionIndex) => `
        <label><input type="radio" name="q-${lessonIndex}-${questionIndex}" value="${optionIndex}" data-answer="${question[2]}"> <span>${option}</span></label>
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
  target.innerHTML = lessons.map((base, index) => {
    const lesson = getLesson(index);
    return `
    <details class="lesson-card reveal" data-lesson="${index}" ${openIndex === index ? "open" : ""}>
      <summary>
        <span class="lesson-number">${String(index + 1).padStart(2, "0")}</span>
        <span class="lesson-title"><strong>${lesson.title}</strong><small>${lesson.focus}</small></span>
        <span class="lesson-tags"><span>${levelNames[selectedDifficulty]}</span><span>${lesson.time}</span></span>
      </summary>
      <div class="lesson-body">
        <section class="lesson-section"><h4>Learning objectives</h4><div class="objective-grid">${list(lesson.objectives)}</div></section>
        <section class="lesson-section"><h4>Detailed explanation</h4>${lesson.explanation.map((paragraph) => `<p>${paragraph}</p>`).join("")}<div class="safety-box"><strong>Safety reminder</strong>${lesson.safety}</div></section>
        <section class="lesson-section"><h4>Step-by-step practice</h4>${list(lesson.steps, true)}<div class="command-block"><div class="command-label"><span>Kali terminal // authorized lab only</span><button class="copy-command" type="button" data-copy-command>Copy</button></div><pre><code>${escapeHtml(lesson.commands)}</code></pre></div>${commandWalkthrough(lesson.commands)}<div class="expected-box"><strong>Expected results and validation</strong>${lesson.expected}</div></section>
        ${lesson.troubleshooting ? `<section class="lesson-section"><h4>Troubleshooting and workflow notes</h4>${list(lesson.troubleshooting)}</section>` : ""}
        <section class="lesson-section"><h4>Common mistakes</h4>${list(lesson.mistakes)}<div class="takeaway-box"><strong>Key takeaway</strong>${lesson.takeaway}</div></section>
        <section class="lesson-section"><h4>Mini quiz</h4><div class="quiz">${renderQuiz(lesson.quiz, index)}</div></section>
        <div class="lesson-actions">
          <span class="quiz-status" id="quizStatus-${index}">Answer all three questions, or reveal an answer to study it.</span>
          <div class="lesson-footer-controls">
            <div class="lesson-nav">
              <button class="btn ghost previous-module" type="button" data-go="${index - 1}" ${index === 0 ? "disabled" : ""}>Previous Module</button>
              <button class="btn ghost next-module" type="button" data-go="${index + 1}" ${index === lessons.length - 1 ? "disabled" : ""}>Next Module</button>
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
  document.querySelector("#progressText").textContent = `${completed.size} of ${lessons.length} ${levelNames[selectedDifficulty]} modules complete`;
  document.querySelector("#progressBar").style.width = `${(completed.size / lessons.length) * 100}%`;
  document.querySelectorAll(".complete-btn").forEach((button) => {
    const isComplete = completed.has(Number(button.dataset.complete));
    button.classList.toggle("completed", isComplete);
    button.textContent = isComplete ? "Completed" : "Mark as complete";
  });
  document.querySelectorAll("[data-difficulty]").forEach((button) => button.classList.toggle("active", button.dataset.difficulty === selectedDifficulty));
  localStorage.setItem(`dmzKaliProgress-${selectedDifficulty}`, JSON.stringify([...completed]));
}

function openModule(index) {
  if (index < 0 || index >= lessons.length) return;
  renderLessons(index);
  const card = document.querySelector(`.lesson-card[data-lesson="${index}"]`);
  card?.scrollIntoView({ behavior: "smooth", block: "start" });
}

renderLessons();

document.querySelector(".difficulty-selector").addEventListener("click", (event) => {
  const button = event.target.closest("[data-difficulty]");
  if (!button || button.dataset.difficulty === selectedDifficulty) return;
  selectedDifficulty = button.dataset.difficulty;
  localStorage.setItem("dmzKaliDifficulty", selectedDifficulty);
  completed = new Set(JSON.parse(localStorage.getItem(`dmzKaliProgress-${selectedDifficulty}`) || "[]"));
  renderLessons(0);
});

document.querySelector("#resetProgress").addEventListener("click", () => {
  completed.clear();
  updateProgress();
});

document.querySelector("#lessonContent").addEventListener("change", (event) => {
  if (!event.target.matches('input[type="radio"]')) return;
  const card = event.target.closest(".lesson-card");
  const lessonIndex = Number(card.dataset.lesson);
  const questions = [...card.querySelectorAll(".quiz-question")];
  const answered = questions.every((question) => question.querySelector("input:checked"));
  if (!answered) return;
  const correct = questions.filter((question) => {
    const selected = question.querySelector("input:checked");
    return Number(selected.value) === Number(selected.dataset.answer);
  }).length;
  document.querySelector(`#quizStatus-${lessonIndex}`).textContent = `${correct}/3 correct. Review explanations for any missed answer.`;
});

document.querySelector("#lessonContent").addEventListener("click", async (event) => {
  const completeButton = event.target.closest(".complete-btn");
  if (completeButton) {
    const index = Number(completeButton.dataset.complete);
    completed.has(index) ? completed.delete(index) : completed.add(index);
    updateProgress();
    return;
  }

  const copyButton = event.target.closest("[data-copy-command]");
  if (copyButton) {
    const code = copyButton.closest(".command-block").querySelector("code").textContent;
    await navigator.clipboard.writeText(code);
    copyButton.textContent = "Copied";
    setTimeout(() => { copyButton.textContent = "Copy"; }, 1200);
    return;
  }

  const revealButton = event.target.closest("[data-reveal-answer]");
  if (revealButton) {
    const answer = revealButton.nextElementSibling;
    answer.classList.toggle("visible");
    revealButton.textContent = answer.classList.contains("visible") ? "Hide answer" : "Reveal answer";
    return;
  }

  const navButton = event.target.closest("[data-go]");
  if (navButton && !navButton.disabled) openModule(Number(navButton.dataset.go));
});


