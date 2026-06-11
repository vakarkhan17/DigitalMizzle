window.DMZ_DATA = {
  courses: [
    {
      id: "kali-foundations",
      title: "Kali Linux Foundations",
      category: "Kali Linux",
      level: "Beginner",
      duration: "6 hours",
      lessons: 18,
      price: "Free",
      summary: "Build a safe Kali workflow, understand core tools, and practice lab-first reconnaissance.",
      modules: ["Lab setup and safety", "Linux terminal essentials", "Recon commands", "Reporting basics"],
      accent: "KALI"
    },
    {
      id: "ethical-hacking-practical-path",
      title: "Ethical Hacking Practical Path",
      category: "Ethical Hacking",
      level: "Intermediate",
      duration: "14 hours",
      lessons: 42,
      price: "Premium",
      summary: "A guided path through enumeration, exploitation, privilege escalation, and documentation.",
      modules: ["Rules of engagement", "Network mapping", "Exploit validation", "Remediation notes"],
      accent: "HACK"
    },
    {
      id: "siem-blue-team",
      title: "SIEM and IDS/IPS Operations",
      category: "SIEM & IDS/IPS",
      level: "Intermediate",
      duration: "10 hours",
      lessons: 30,
      price: "Premium",
      summary: "Tune alerts, investigate events, and build practical detections for modern environments.",
      modules: ["Log sources", "Detection logic", "Alert triage", "Incident timeline"],
      accent: "SIEM"
    },
    {
      id: "web-app-security",
      title: "Web Application Security Lab",
      category: "Web Application Security",
      level: "Advanced",
      duration: "12 hours",
      lessons: 36,
      price: "Premium",
      summary: "Practice OWASP-style testing with repeatable labs and clear defensive recommendations.",
      modules: ["Proxy setup", "Auth testing", "Injection risks", "Secure fixes"],
      accent: "WEB"
    }
  ],
  blogs: [
    {
      id: "kali-linux-workflow",
      route: "blog-kali-linux-workflow.html",
      featuredImage: "assets/img/blogs/kali-linux-workflow.png",
      title: "Building a Clean Kali Linux Workflow for Beginners",
      category: "Kali Linux",
      author: "DigitalMizzle Team",
      date: "June 4, 2026",
      readTime: "11 min read",
      tags: ["Kali", "Labs", "Beginner"],
      excerpt: "A practical guide to keeping your ethical hacking lab organized, legal, and repeatable.",
      meta: "Learn how to organize Kali Linux labs, notes, tools, and evidence for ethical hacking practice."
    },
    {
      id: "siem-detection-basics",
      route: "blog-siem-detection-basics.html",
      featuredImage: "assets/img/blogs/siem-detection-basics.png",
      title: "SIEM Detection Basics: From Noisy Logs to Useful Alerts",
      category: "SIEM",
      author: "DigitalMizzle Team",
      date: "May 28, 2026",
      readTime: "13 min read",
      tags: ["SIEM", "Detection", "SOC"],
      excerpt: "How to think about log sources, false positives, and detection rules that actually help analysts.",
      meta: "Understand SIEM detection basics, alert quality, and practical SOC investigation workflows."
    },
    {
      id: "nethunter-mobile-labs",
      route: "blog-nethunter-mobile-labs.html",
      featuredImage: "assets/img/blogs/nethunter-mobile-labs.png",
      title: "NetHunter Mobile Labs: Responsible Practice Setup",
      category: "NetHunter",
      author: "DigitalMizzle Team",
      date: "May 20, 2026",
      readTime: "12 min read",
      tags: ["NetHunter", "Mobile", "Awareness"],
      excerpt: "Create controlled mobile security labs while respecting authorization and local laws.",
      meta: "Set up responsible NetHunter labs for mobile security education and cyber awareness."
    }
  ],
  tools: [
    {
      id: "nmap",
      name: "Nmap",
      category: "Reconnaissance",
      platform: "Linux, macOS, Windows",
      command: "sudo apt install nmap",
      usage: "nmap -sV -sC 192.168.56.10",
      useCase: "Map authorized hosts, services, and versions during assessments.",
      link: "https://nmap.org/",
      description: "A network discovery and service enumeration utility used by defenders and testers."
    },
    {
      id: "burp-suite",
      name: "Burp Suite",
      category: "Web Application Security",
      platform: "Linux, macOS, Windows",
      command: "Download from the official PortSwigger site",
      usage: "Proxy browser traffic through 127.0.0.1:8080",
      useCase: "Inspect, test, and document web application security findings.",
      link: "https://portswigger.net/burp",
      description: "An intercepting proxy and testing toolkit for authorized web application assessments."
    },
    {
      id: "suricata",
      name: "Suricata",
      category: "SIEM/Monitoring",
      platform: "Linux, Network sensors",
      command: "sudo apt install suricata",
      usage: "suricata -r traffic.pcap -k none",
      useCase: "Analyze network traffic and generate IDS alerts for investigations.",
      link: "https://suricata.io/",
      description: "A high-performance network threat detection engine for monitoring and packet analysis."
    },
    {
      id: "john",
      name: "John the Ripper",
      category: "Password Attacks",
      platform: "Linux, macOS, Windows",
      command: "sudo apt install john",
      usage: "john --wordlist=wordlist.txt hashes.txt",
      useCase: "Audit password strength in approved environments.",
      link: "https://www.openwall.com/john/",
      description: "A password auditing tool for testing hash resilience and password policy effectiveness."
    }
  ],
  downloads: [],
  activities: [
    "New user registered for Kali Linux Foundations",
    "Blog draft updated: SIEM Detection Basics",
    "Tool page published: Suricata",
    "Download added: Alert Triage Worksheet"
  ]
};

