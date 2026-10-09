import React, { useState, useMemo } from 'react';
import {
  X,
  Search,
  CheckCircle2,
  Clock,
  GitCommit,
  GitBranch,
  User,
  Download,
  Terminal,
  Play,
  RotateCw,
  ExternalLink,
  Smartphone,
  FileCode,
  Layers,
  ChevronRight,
  ChevronDown,
  Filter,
  Check,
  Copy,
  AlertCircle,
  QrCode,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { downloadApkFile, CURRENT_APK_BUILD, ApkBuildInfo } from '../../utils/apkGenerator';
import { WellsFargoLogosTab } from './WellsFargoLogosTab';
import { AndroidDiagnosticsTab } from './AndroidDiagnosticsTab';

export interface WorkflowRun {
  id: number;
  runNumber: number;
  title: string;
  workflowName: string;
  status: 'success' | 'in_progress' | 'failed' | 'queued';
  commitSha: string;
  author: string;
  branch: string;
  timestamp: string;
  duration: string;
  apkSize: string;
  buildType: 'release' | 'debug';
  logs: string[];
}

const INITIAL_RUNS: WorkflowRun[] = [
  {
    id: 37,
    runNumber: 37,
    title: 'feat: add personal page and community chat',
    workflowName: 'Build Android APK',
    status: 'success',
    commitSha: '9903222',
    author: 'cashcold',
    branch: 'main',
    timestamp: 'Today at 6:47 PM',
    duration: '1m 31s',
    apkSize: '18.4 MB',
    buildType: 'release',
    logs: [
      '2026-10-09T18:45:30.120Z Initializing Build Android APK runner (ubuntu-latest)',
      '2026-10-09T18:45:32.410Z actions/checkout@v4 - checked out 99032228f4a13c9e',
      '2026-10-09T18:45:35.801Z Setup Node.js v20.18.0 & cache',
      '2026-10-09T18:45:45.190Z npm install --legacy-peer-deps: resolved 342 packages in 9.2s',
      '2026-10-09T18:45:52.011Z vite build: transformed 182 modules -> dist/assets/index.js (312.4 kB)',
      '2026-10-09T18:45:56.241Z actions/setup-java@v4: Temurin OpenJDK 17.0.10+7 configured',
      '2026-10-09T18:46:08.520Z android-actions/setup-android@v3: SDK 34, build-tools 34.0.0 ready',
      '2026-10-09T18:46:12.100Z npx @capacitor/cli sync android: updated web assets into android/app/src/main/assets/public',
      '2026-10-09T18:46:48.330Z ./gradlew assembleRelease: BUILD SUCCESSFUL in 36s (28 actionable tasks)',
      '2026-10-09T18:46:58.110Z zipalign & apksigner: app-release.apk verified with Signature Scheme v2/v3',
      '2026-10-09T18:47:01.002Z actions/upload-artifact@v4: uploaded app-release.apk (18.4 MB) -> Artifact #482910',
      '2026-10-09T18:47:01.400Z Job completed successfully in 1m 31s',
    ],
  },
  {
    id: 36,
    runNumber: 36,
    title: 'feat: enhance betting history and server security',
    workflowName: 'Build Android APK',
    status: 'success',
    commitSha: '1ef5948',
    author: 'cashcold',
    branch: 'main',
    timestamp: 'Oct 7, 8:39 PM GMT',
    duration: '3m 21s',
    apkSize: '18.2 MB',
    buildType: 'release',
    logs: [
      '2026-10-07T20:36:01.210Z Initializing Build Android APK runner (ubuntu-latest)',
      '2026-10-07T20:36:04.110Z actions/checkout@v4 - checked out 1ef5948b89a42e1',
      '2026-10-07T20:36:09.300Z npm install --legacy-peer-deps: verified 342 packages',
      '2026-10-07T20:36:18.990Z vite build: transformed 179 modules -> dist/',
      '2026-10-07T20:36:45.220Z android SDK compile & Gradle daemon build',
      '2026-10-07T20:39:15.800Z ./gradlew assembleRelease: BUILD SUCCESSFUL in 2m 30s',
      '2026-10-07T20:39:22.400Z actions/upload-artifact@v4: uploaded app-release.apk (18.2 MB)',
      '2026-10-07T20:39:22.900Z Job completed successfully in 3m 21s',
    ],
  },
  {
    id: 35,
    runNumber: 35,
    title: 'feat: enhance match markets and add fixtures',
    workflowName: 'Build Android APK',
    status: 'success',
    commitSha: '4a8b291',
    author: 'cashcold',
    branch: 'main',
    timestamp: 'Oct 5, 2:14 PM GMT',
    duration: '2m 45s',
    apkSize: '18.1 MB',
    buildType: 'release',
    logs: [
      '2026-10-05T14:11:15.100Z actions/checkout@v4 - checked out 4a8b291c900e4',
      '2026-10-05T14:11:40.210Z npm run build: production bundle compiled',
      '2026-10-05T14:13:50.000Z ./gradlew assembleRelease: BUILD SUCCESSFUL',
      '2026-10-05T14:14:00.110Z actions/upload-artifact@v4: uploaded app-release.apk (18.1 MB)',
      '2026-10-05T14:14:00.400Z Job completed successfully in 2m 45s',
    ],
  },
  {
    id: 34,
    runNumber: 34,
    title: 'feat: update total liquid balance to $5,000,000 USD and sync accounts',
    workflowName: 'Build Android APK',
    status: 'success',
    commitSha: '7f91204',
    author: 'cashcold',
    branch: 'main',
    timestamp: 'Oct 4, 11:20 AM GMT',
    duration: '1m 45s',
    apkSize: '18.0 MB',
    buildType: 'release',
    logs: [
      '2026-10-04T11:18:15.000Z actions/checkout@v4 - checked out 7f91204',
      '2026-10-04T11:18:40.000Z vite build: updated account financial models',
      '2026-10-04T11:20:00.000Z ./gradlew assembleRelease: BUILD SUCCESSFUL',
      '2026-10-04T11:20:00.400Z Job completed successfully in 1m 45s',
    ],
  },
  {
    id: 33,
    runNumber: 33,
    title: 'fix: resolve peerOptional esbuild dependency resolution for Vite 8',
    workflowName: 'Build Android APK',
    status: 'success',
    commitSha: '8c221a9',
    author: 'cashcold',
    branch: 'main',
    timestamp: 'Oct 3, 4:12 PM GMT',
    duration: '1m 12s',
    apkSize: '18.0 MB',
    buildType: 'release',
    logs: [
      '2026-10-03T16:10:48.000Z actions/checkout@v4 - checked out 8c221a9',
      '2026-10-03T16:11:10.000Z npm install: legacy-peer-deps verified',
      '2026-10-03T16:12:00.000Z ./gradlew assembleRelease: BUILD SUCCESSFUL',
      '2026-10-03T16:12:00.300Z Job completed successfully in 1m 12s',
    ],
  },
  {
    id: 32,
    runNumber: 32,
    title: 'feat: add consumer signature card W-9 tax certification modal',
    workflowName: 'Build Android APK',
    status: 'success',
    commitSha: '2d11940',
    author: 'cashcold',
    branch: 'main',
    timestamp: 'Oct 2, 7:55 PM GMT',
    duration: '2m 04s',
    apkSize: '17.9 MB',
    buildType: 'release',
    logs: [
      '2026-10-02T19:53:00.000Z actions/checkout@v4 - checked out 2d11940',
      '2026-10-02T19:55:04.000Z ./gradlew assembleRelease: BUILD SUCCESSFUL',
    ],
  },
  {
    id: 31,
    runNumber: 31,
    title: 'feat: implement interactive loan payoff calculator and disclosure PDF',
    workflowName: 'Build Android APK',
    status: 'success',
    commitSha: '6e44021',
    author: 'cashcold',
    branch: 'main',
    timestamp: 'Sep 30, 9:15 AM GMT',
    duration: '2m 18s',
    apkSize: '17.8 MB',
    buildType: 'release',
    logs: ['2026-09-30T09:15:00.000Z Job completed successfully in 2m 18s'],
  },
  {
    id: 30,
    runNumber: 30,
    title: 'fix: dynamic daytime greeting calculation for afternoon/evening',
    workflowName: 'Build Android APK',
    status: 'success',
    commitSha: '5ab8901',
    author: 'cashcold',
    branch: 'main',
    timestamp: 'Sep 28, 3:40 PM GMT',
    duration: '1m 20s',
    apkSize: '17.8 MB',
    buildType: 'release',
    logs: ['2026-09-28T15:40:00.000Z Job completed successfully in 1m 20s'],
  },
];

// Generate earlier runs to fulfill 37 workflow runs
for (let i = 29; i >= 1; i--) {
  INITIAL_RUNS.push({
    id: i,
    runNumber: i,
    title:
      i === 29
        ? 'feat: Wells Fargo mobile banking UI stabilization'
        : i === 28
        ? 'feat: add Ask Fargo AI conversational assistant'
        : i === 27
        ? 'feat: add Set Aside bill saving rules and auto-budgeting'
        : i === 26
        ? 'feat: add Mobile Check Deposit back/front capture'
        : i === 25
        ? 'chore: configure Capacitor Android Gradle wrapper & SDK 34'
        : `feat: mobile banking optimization and UI enhancements #${i}`,
    workflowName: 'Build Android APK',
    status: 'success',
    commitSha: Math.random().toString(16).substring(2, 9),
    author: 'cashcold',
    branch: 'main',
    timestamp: `Sep ${Math.max(1, Math.floor(i / 1.2))}, 2026`,
    duration: `${1 + (i % 2)}m ${15 + (i * 3) % 45}s`,
    apkSize: `${(17.2 + (i * 0.03)).toFixed(1)} MB`,
    buildType: 'release',
    logs: [`Build #${i} completed successfully on runner ubuntu-latest`],
  });
}

interface AndroidWorkflowsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'workflows' | 'download' | 'logos' | 'diagnostics' | 'workflow-file';
}

export const AndroidWorkflowsModal: React.FC<AndroidWorkflowsModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'workflows',
}) => {
  const [activeTab, setActiveTab] = useState<'workflows' | 'download' | 'logos' | 'diagnostics' | 'workflow-file'>(initialTab);
  const [runs, setRuns] = useState<WorkflowRun[]>(INITIAL_RUNS);
  const [selectedRun, setSelectedRun] = useState<WorkflowRun | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [dispatchBranch, setDispatchBranch] = useState('main');
  const [dispatchBuildType, setDispatchBuildType] = useState<'release' | 'debug'>('release');
  const [isSimulatingBuild, setIsSimulatingBuild] = useState(false);
  const [copiedYaml, setCopiedYaml] = useState(false);
  const [activeWorkflowNav, setActiveWorkflowNav] = useState('Build Android APK');

  if (!isOpen) return null;

  const filteredRuns = useMemo(() => {
    return runs.filter((run) => {
      const matchSearch =
        run.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        run.commitSha.toLowerCase().includes(searchQuery.toLowerCase()) ||
        run.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `#${run.runNumber}`.includes(searchQuery);

      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'success' && run.status === 'success') ||
        (statusFilter === 'in_progress' && run.status === 'in_progress');

      return matchSearch && matchStatus;
    });
  }, [runs, searchQuery, statusFilter]);

  const handleRunNewWorkflow = () => {
    setIsDispatchModalOpen(false);
    setIsSimulatingBuild(true);

    const newRunNumber = runs[0].runNumber + 1;
    const newRun: WorkflowRun = {
      id: newRunNumber,
      runNumber: newRunNumber,
      title: 'manual: dispatch build Android APK for release',
      workflowName: 'Build Android APK',
      status: 'in_progress',
      commitSha: Math.random().toString(16).substring(2, 9),
      author: 'cashcold',
      branch: dispatchBranch,
      timestamp: 'Just now',
      duration: 'running...',
      apkSize: '18.4 MB',
      buildType: dispatchBuildType,
      logs: [
        `Starting Build Android APK #${newRunNumber} triggered via workflow_dispatch by cashcold`,
        'Allocating GitHub-hosted runner: ubuntu-latest (2-core vCPU, 7GB RAM)',
        'Checking out branch: ' + dispatchBranch,
        'Setting up Node.js 20 & Java 17 Temurin...',
      ],
    };

    setRuns([newRun, ...runs]);
    setSelectedRun(newRun);

    // Simulate build progress
    setTimeout(() => {
      setRuns((prev) =>
        prev.map((r) =>
          r.id === newRunNumber
            ? {
                ...r,
                logs: [
                  ...r.logs,
                  'npm install --legacy-peer-deps: done in 8.4s',
                  'npm run build: Vite production build passed (dist/ ready)',
                  'npx @capacitor/cli sync android: synchronizing plugins & assets',
                  './gradlew assembleRelease: Compiling DEX bytecode and packing resources...',
                ],
              }
            : r
        )
      );
    }, 2000);

    setTimeout(() => {
      setRuns((prev) =>
        prev.map((r) =>
          r.id === newRunNumber
            ? {
                ...r,
                status: 'success',
                duration: '1m 24s',
                logs: [
                  ...r.logs,
                  'BUILD SUCCESSFUL in 42s',
                  'Zipalign & APK signing completed with v2/v3 signature',
                  'actions/upload-artifact@v4: uploaded app-release.apk',
                  'Job completed successfully.',
                ],
              }
            : r
        )
      );
      setIsSimulatingBuild(false);
    }, 4500);
  };

  const handleDownloadApk = (run?: WorkflowRun) => {
    const buildInfo: ApkBuildInfo = {
      version: '1.4.2',
      buildNumber: run ? run.runNumber : CURRENT_APK_BUILD.buildNumber,
      commitSha: run ? run.commitSha : CURRENT_APK_BUILD.commitSha,
      buildType: run ? run.buildType : CURRENT_APK_BUILD.buildType,
      fileSizeMb: run ? parseFloat(run.apkSize) : CURRENT_APK_BUILD.fileSizeMb,
      sha256: CURRENT_APK_BUILD.sha256,
    };
    downloadApkFile(buildInfo);
  };

  const workflowYaml = `name: Build Android APK

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
  workflow_dispatch:
    inputs:
      build_type:
        description: 'Build Type'
        required: true
        default: 'release'
        type: choice
        options:
          - release
          - debug

jobs:
  build:
    name: Build Android APK
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm install --legacy-peer-deps

      - name: Build web assets
        run: npm run build

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Setup Android SDK & Accept All Licenses
        run: |
          echo "Configuring Android SDK licenses non-interactively..."
          mkdir -p "$ANDROID_HOME/licenses" || true
          printf "89388a2477920b04c52f146487e7fb6142e00942\\n504667f4c0de7af1a06de9f4b1727b816f454d0d\\n24333f8a63b1d8f28fe8d17222e329bc7ec80a2b\\nd56f5187479451eabf01fb78af6dfcb131a6481e\\n" > "$ANDROID_HOME/licenses/android-sdk-license"
          printf "84831b9409646a918e30573bab4c9c91346d8abd\\n" > "$ANDROID_HOME/licenses/android-sdk-preview-license"
          printf "33b6a2b64607f11b759f320ef9dff4ae5c47d97a\\n" > "$ANDROID_HOME/licenses/google-gdk-license"
          printf "e9acab5b5fbb560a72cfa4f6d0b1f9eb8a1e47e0\\n" > "$ANDROID_HOME/licenses/mips-android-sdk-license"
          printf "601085b94cd77f0b54ff864069570991500085cd\\n" > "$ANDROID_HOME/licenses/android-googletv-license"
          printf "859f317696f67ef3d7f30a50a5560e7834b433fb\\n" > "$ANDROID_HOME/licenses/android-sdk-arm-dbt-license"
          if [ -x "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" ]; then
            yes | "$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager" --licenses || true
          fi

      - name: Cache Gradle packages
        uses: actions/cache@v4
        with:
          path: |
            ~/.gradle/caches
            ~/.gradle/wrapper
          key: \${{ runner.os }}-gradle-\${{ hashFiles('**/*.gradle*', '**/gradle-wrapper.properties') }}
          restore-keys: |
            \${{ runner.os }}-gradle-

      - name: Prepare Capacitor Android
        run: |
          npx --yes @capacitor/cli sync android || true

      - name: Build Android APK (\${{ inputs.build_type || 'release' }})
        run: |
          cd android
          chmod +x gradlew || true
          if [ "\${{ inputs.build_type }}" = "debug" ]; then
            ./gradlew assembleDebug --no-daemon --stacktrace
          else
            ./gradlew assembleRelease --no-daemon --stacktrace || ./gradlew assembleDebug --no-daemon --stacktrace
          fi

      - name: Upload Android APK
        uses: actions/upload-artifact@v4
        with:
          name: app-\${{ inputs.build_type || 'release' }}-apk
          path: |
            android/app/build/outputs/apk/**/*.apk
          retention-days: 30
          if-no-files-found: warn`;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-6xl bg-[#0d1117] text-[#c9d1d9] border border-[#30363d] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 font-sans">
        {/* Top GitHub Navigation Bar */}
        <div className="bg-[#161b22] border-b border-[#30363d] px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-white rounded-full flex items-center justify-center text-[#0d1117]">
              {/* GitHub Mark */}
              <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm">
              <span className="text-[#8b949e]">cashcold</span>
              <span className="text-[#8b949e]">/</span>
              <span className="font-semibold text-white">wellsfargo-mobile</span>
              <span className="bg-[#21262d] text-[#8b949e] text-[11px] px-2 py-0.5 rounded-full ml-1 border border-[#30363d]">
                Public
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleDownloadApk()}
              className="bg-[#238636] hover:bg-[#2ea043] text-white px-3 py-1.5 rounded-md font-medium text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Download APK</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#8b949e] hover:text-white hover:bg-[#21262d] rounded-md transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Header */}
        <div className="bg-[#0d1117] border-b border-[#30363d] px-4 pt-2 flex items-center gap-4 overflow-x-auto text-xs shrink-0">
          <button
            onClick={() => {
              setActiveTab('workflows');
              setSelectedRun(null);
            }}
            className={`pb-2.5 px-2 border-b-2 font-medium flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'workflows'
                ? 'border-[#f78166] text-white font-semibold'
                : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <Play className="w-3.5 h-3.5 text-[#8b949e]" />
            <span>Actions / Workflows</span>
            <span className="bg-[#21262d] text-[#8b949e] text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              {runs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className={`pb-2.5 px-2 border-b-2 font-medium flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'download'
                ? 'border-[#f78166] text-white font-semibold'
                : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-[#3fb950]" />
            <span>Install Android APK</span>
            <span className="bg-[#238636]/20 text-[#3fb950] border border-[#238636]/30 text-[10px] px-1.5 py-0.2 rounded-full">
              v1.4.2
            </span>
          </button>

          <button
            onClick={() => setActiveTab('logos')}
            className={`pb-2.5 px-2 border-b-2 font-medium flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'logos'
                ? 'border-[#f78166] text-white font-semibold'
                : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#ffd54f]" />
            <span>Wells Fargo Logos (Web & Phone)</span>
          </button>

          <button
            onClick={() => setActiveTab('diagnostics')}
            className={`pb-2.5 px-2 border-b-2 font-medium flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'diagnostics'
                ? 'border-[#f78166] text-white font-semibold'
                : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#3fb950]" />
            <span>Android Error Resolver</span>
            <span className="bg-[#388bfd]/20 text-[#58a6ff] border border-[#388bfd]/30 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
              Fixed
            </span>
          </button>

          <button
            onClick={() => setActiveTab('workflow-file')}
            className={`pb-2.5 px-2 border-b-2 font-medium flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'workflow-file'
                ? 'border-[#f78166] text-white font-semibold'
                : 'border-transparent text-[#8b949e] hover:text-[#c9d1d9]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-[#58a6ff]" />
            <span>.github/workflows/build-apk.yml</span>
          </button>
        </div>

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'workflows' && !selectedRun && (
            <div className="grid grid-cols-1 md:grid-cols-4 min-h-full">
              {/* Left Sidebar: Workflow Selector */}
              <div className="border-r border-[#30363d] p-4 bg-[#0d1117] md:col-span-1 space-y-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#8b949e]">
                  Workflows
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => setActiveWorkflowNav('All workflows')}
                    className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium flex items-center justify-between transition-colors ${
                      activeWorkflowNav === 'All workflows'
                        ? 'bg-[#21262d] text-white'
                        : 'text-[#c9d1d9] hover:bg-[#161b22]'
                    }`}
                  >
                    <span>All workflows</span>
                    <span className="text-[#8b949e] font-mono">{runs.length}</span>
                  </button>

                  <button
                    onClick={() => setActiveWorkflowNav('Build Android APK')}
                    className={`w-full text-left px-3 py-2 rounded-md text-xs font-medium flex items-center justify-between transition-colors ${
                      activeWorkflowNav === 'Build Android APK'
                        ? 'bg-[#21262d] text-white font-semibold'
                        : 'text-[#c9d1d9] hover:bg-[#161b22]'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-2 h-2 rounded-full bg-[#3fb950] shrink-0" />
                      <span className="truncate">Build Android APK</span>
                    </div>
                    <span className="text-[#8b949e] font-mono">{runs.length}</span>
                  </button>

                  <button
                    onClick={() => setActiveWorkflowNav('Web CI & Lint')}
                    className="w-full text-left px-3 py-2 rounded-md text-xs text-[#8b949e] hover:bg-[#161b22] flex items-center justify-between"
                  >
                    <span className="truncate">Web CI & Lint</span>
                    <span className="font-mono">14</span>
                  </button>

                  <button
                    onClick={() => setActiveWorkflowNav('Vercel Deploy')}
                    className="w-full text-left px-3 py-2 rounded-md text-xs text-[#8b949e] hover:bg-[#161b22] flex items-center justify-between"
                  >
                    <span className="truncate">Vercel Production</span>
                    <span className="font-mono">22</span>
                  </button>
                </div>

                {/* Quick Info Box */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-3 text-xs space-y-2">
                  <div className="text-white font-semibold flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-[#3fb950]" />
                    <span>Android Packaging</span>
                  </div>
                  <div className="text-[11px] text-[#8b949e] leading-relaxed">
                    Builds are executed on Ubuntu runners using JDK 17, Android SDK API 34, and Gradle. Every run automatically generates signed installable APK artifacts.
                  </div>
                  <div className="pt-1 flex items-center justify-between text-[11px] border-t border-[#30363d]/60">
                    <span className="text-[#8b949e]">Default Branch:</span>
                    <span className="text-white font-mono">main</span>
                  </div>
                </div>
              </div>

              {/* Right Content Area: Exact UI from Prompt */}
              <div className="md:col-span-3 p-4 sm:p-6 bg-[#0d1117] flex flex-col">
                {/* Header matching user text: "All workflows", "Showing runs from all workflows" */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#30363d]">
                  <div>
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                      <span>{activeWorkflowNav}</span>
                    </h2>
                    <p className="text-xs text-[#8b949e] mt-0.5">
                      Showing runs from all workflows
                    </p>
                  </div>

                  {/* Dispatch / Run workflow button */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsDispatchModalOpen(true)}
                      className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-white px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Play className="w-3 h-3 text-[#3fb950] fill-[#3fb950]" />
                      <span>Run workflow</span>
                      <ChevronDown className="w-3 h-3 text-[#8b949e]" />
                    </button>
                  </div>
                </div>

                {/* Filter and Search Bar matching prompt: "Filter workflow runs", "Search runs" */}
                <div className="py-3 flex flex-col sm:flex-row gap-2 items-stretch sm:items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-[#8b949e] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter workflow runs / Search runs"
                      className="w-full bg-[#161b22] border border-[#30363d] rounded-md pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#8b949e] focus:outline-hidden focus:border-[#58a6ff]"
                    />
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-[#161b22] border border-[#30363d] rounded-md px-2.5 py-1.5 text-xs text-[#c9d1d9] focus:outline-hidden"
                    >
                      <option value="all">All statuses</option>
                      <option value="success">Success</option>
                      <option value="in_progress">In progress</option>
                    </select>

                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                      }}
                      className="text-xs text-[#58a6ff] hover:underline px-2"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Workflow runs count badge matching prompt: "Workflow runs", "37 workflow runs" */}
                <div className="bg-[#161b22] border border-[#30363d] rounded-t-lg px-4 py-2.5 flex items-center justify-between text-xs text-[#8b949e]">
                  <div className="flex items-center gap-2 font-medium text-[#c9d1d9]">
                    <span>Workflow runs</span>
                    <span className="font-semibold text-white">
                      {filteredRuns.length} workflow runs
                    </span>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 text-[11px]">
                    <span>Actor: cashcold</span>
                    <span>Branch: main</span>
                  </div>
                </div>

                {/* Runs List Items matching the prompt format */}
                <div className="border-x border-b border-[#30363d] rounded-b-lg divide-y divide-[#30363d] bg-[#0d1117] overflow-hidden">
                  {filteredRuns.map((run) => (
                    <div
                      key={run.id}
                      onClick={() => setSelectedRun(run)}
                      className="p-3.5 hover:bg-[#161b22]/70 transition-colors flex items-start justify-between gap-3 cursor-pointer group"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Status Icon */}
                        <div className="mt-0.5 shrink-0">
                          {run.status === 'success' ? (
                            <CheckCircle2 className="w-4 h-4 text-[#3fb950]" />
                          ) : run.status === 'in_progress' ? (
                            <RotateCw className="w-4 h-4 text-[#d29922] animate-spin" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-[#f85149]" />
                          )}
                        </div>

                        {/* Text matching user prompt verbatim:
                            "feat: add personal page and community chat"
                            "completed successfully:"
                            "Build Android APK"
                            "#37:"
                            "Commit 9903222 pushed by cashcold main Today at 6:47 PM 1m 31s"
                        */}
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-white text-xs sm:text-sm group-hover:text-[#58a6ff] transition-colors truncate">
                              {run.title}
                            </span>
                          </div>

                          <div className="text-xs text-[#8b949e] flex items-center gap-1.5 flex-wrap">
                            <span className="text-[#3fb950] font-medium">
                              {run.status === 'success'
                                ? 'completed successfully:'
                                : run.status === 'in_progress'
                                ? 'running:'
                                : 'failed:'}
                            </span>
                            <span className="text-[#c9d1d9] font-medium">
                              {run.workflowName}
                            </span>
                            <span className="text-white font-mono font-semibold">
                              #{run.runNumber}:
                            </span>
                          </div>

                          <div className="text-[11px] text-[#8b949e] flex items-center gap-2 flex-wrap pt-0.5">
                            <div className="flex items-center gap-1">
                              <GitCommit className="w-3 h-3 text-[#8b949e]" />
                              <span>Commit</span>
                              <span className="font-mono text-[#58a6ff]">
                                {run.commitSha}
                              </span>
                            </div>
                            <span>pushed by</span>
                            <span className="text-[#c9d1d9] font-medium">
                              {run.author}
                            </span>
                            <div className="flex items-center gap-1 bg-[#21262d] px-1.5 py-0.2 rounded-xs text-[#c9d1d9] font-mono text-[10px]">
                              <GitBranch className="w-2.5 h-2.5" />
                              <span>{run.branch}</span>
                            </div>
                            <span>•</span>
                            <span>{run.timestamp}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{run.duration}</span>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Action: Download APK pill */}
                      <div className="shrink-0 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleDownloadApk(run)}
                          className="bg-[#21262d] hover:bg-[#30363d] hover:text-white border border-[#30363d] text-[#c9d1d9] px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors"
                          title="Download Android APK generated from this run"
                        >
                          <Download className="w-3 h-3 text-[#3fb950]" />
                          <span className="hidden sm:inline">APK</span>
                          <span className="text-[10px] text-[#8b949e] font-mono">
                            {run.apkSize}
                          </span>
                        </button>
                        <ChevronRight className="w-4 h-4 text-[#8b949e] group-hover:text-white transition-colors" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Selected Run Detailed Execution View */}
          {activeTab === 'workflows' && selectedRun && (
            <div className="p-4 sm:p-6 space-y-6">
              {/* Back button and Run Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#30363d]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedRun(null)}
                    className="text-[#8b949e] hover:text-white text-xs flex items-center gap-1 bg-[#21262d] px-2.5 py-1.5 rounded-md border border-[#30363d]"
                  >
                    <span>← All runs</span>
                  </button>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                      <span className="truncate">{selectedRun.title}</span>
                    </h2>
                    <p className="text-xs text-[#8b949e] mt-0.5">
                      {selectedRun.workflowName} #{selectedRun.runNumber} • Commit {selectedRun.commitSha} • pushed by {selectedRun.author} to {selectedRun.branch}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownloadApk(selectedRun)}
                    className="bg-[#238636] hover:bg-[#2ea043] text-white px-3.5 py-1.5 rounded-md font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download APK ({selectedRun.apkSize})</span>
                  </button>
                </div>
              </div>

              {/* Status & Summary Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-2">
                  <div className="text-xs text-[#8b949e] font-medium">Workflow Status</div>
                  <div className="flex items-center gap-2">
                    {selectedRun.status === 'success' ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-[#3fb950]" />
                        <span className="font-semibold text-white text-sm">
                          Completed successfully
                        </span>
                      </>
                    ) : (
                      <>
                        <RotateCw className="w-4 h-4 text-[#d29922] animate-spin" />
                        <span className="font-semibold text-white text-sm">
                          In progress
                        </span>
                      </>
                    )}
                  </div>
                  <div className="text-xs text-[#8b949e]">
                    Total elapsed time: <span className="text-white font-mono">{selectedRun.duration}</span>
                  </div>
                </div>

                <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-2">
                  <div className="text-xs text-[#8b949e] font-medium">Git Details</div>
                  <div className="text-xs flex items-center gap-2">
                    <GitBranch className="w-3.5 h-3.5 text-[#8b949e]" />
                    <span className="text-white font-mono">{selectedRun.branch}</span>
                    <span className="text-[#8b949e]">•</span>
                    <GitCommit className="w-3.5 h-3.5 text-[#8b949e]" />
                    <span className="text-[#58a6ff] font-mono">{selectedRun.commitSha}</span>
                  </div>
                  <div className="text-xs text-[#8b949e]">
                    Pushed by <span className="text-[#c9d1d9]">{selectedRun.author}</span> at {selectedRun.timestamp}
                  </div>
                </div>

                <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 space-y-2">
                  <div className="text-xs text-[#8b949e] font-medium">Artifacts Generated</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-white">app-{selectedRun.buildType}.apk</span>
                    <span className="text-xs text-[#3fb950] font-mono">{selectedRun.apkSize}</span>
                  </div>
                  <div className="text-[11px] text-[#8b949e] truncate">
                    SHA-256: {CURRENT_APK_BUILD.sha256.substring(0, 16)}...
                  </div>
                </div>
              </div>

              {/* Build Jobs Breakdown & Live Terminal Output */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-[#30363d] flex items-center justify-between bg-[#161b22]">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white">
                    <Terminal className="w-4 h-4 text-[#58a6ff]" />
                    <span>Job: Build Android APK (ubuntu-latest, JDK 17, Gradle 8.2)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadApk(selectedRun)}
                      className="text-xs text-[#58a6ff] hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download Artifact</span>
                    </button>
                  </div>
                </div>

                {/* Job Steps Breakdown */}
                <div className="p-3 bg-[#0d1117] border-b border-[#30363d] divide-y divide-[#30363d]/50 text-xs">
                  <div className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950]" />
                      <span className="text-white">1. Set up job</span>
                    </div>
                    <span className="text-[#8b949e] font-mono">2s</span>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950]" />
                      <span className="text-white">2. Run actions/checkout@v4</span>
                    </div>
                    <span className="text-[#8b949e] font-mono">3s</span>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950]" />
                      <span className="text-white">3. Set up JDK 17 (Temurin)</span>
                    </div>
                    <span className="text-[#8b949e] font-mono">4s</span>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950]" />
                      <span className="text-white">4. Setup Android SDK Tools (API 34, NDK)</span>
                    </div>
                    <span className="text-[#8b949e] font-mono">11s</span>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950]" />
                      <span className="text-white">5. Install dependencies (npm install --legacy-peer-deps)</span>
                    </div>
                    <span className="text-[#8b949e] font-mono">18s</span>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950]" />
                      <span className="text-white">6. Build web assets (vite build)</span>
                    </div>
                    <span className="text-[#8b949e] font-mono">7s</span>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950]" />
                      <span className="text-white">7. Prepare Capacitor Android Sync</span>
                    </div>
                    <span className="text-[#8b949e] font-mono">4s</span>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950]" />
                      <span className="text-white">8. Build Android APK (./gradlew assembleRelease)</span>
                    </div>
                    <span className="text-[#8b949e] font-mono">36s</span>
                  </div>
                  <div className="py-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#3fb950]" />
                      <span className="text-white">9. Upload Android APK Artifact (actions/upload-artifact@v4)</span>
                    </div>
                    <span className="text-[#8b949e] font-mono">1s</span>
                  </div>
                </div>

                {/* Console Log Terminal Output */}
                <div className="p-4 bg-[#090d13] font-mono text-xs text-[#8b949e] space-y-1 overflow-x-auto max-h-72">
                  {selectedRun.logs.map((log, index) => (
                    <div key={index} className="leading-relaxed">
                      <span className="text-[#58a6ff] select-none mr-2">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      {log.includes('SUCCESSFUL') || log.includes('successfully') ? (
                        <span className="text-[#3fb950] font-semibold">{log}</span>
                      ) : log.includes('ERROR') || log.includes('failed') ? (
                        <span className="text-[#f85149] font-semibold">{log}</span>
                      ) : (
                        <span className="text-[#c9d1d9]">{log}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Android APK Download & Installation Center */}
          {activeTab === 'download' && (
            <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
              <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 sm:p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#238636] to-[#3fb950] text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-900/30">
                  <Smartphone className="w-9 h-9" />
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Wells Fargo Mobile Android APK
                  </h3>
                  <p className="text-xs sm:text-sm text-[#8b949e] mt-1">
                    Native Android Client • Built with Capacitor & Vite • Version 1.4.2 (Build #37)
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
                  <span className="bg-[#21262d] text-[#c9d1d9] px-3 py-1 rounded-full border border-[#30363d]">
                    Package: <strong className="text-white">com.wellsfargo.mobile.banking</strong>
                  </span>
                  <span className="bg-[#21262d] text-[#c9d1d9] px-3 py-1 rounded-full border border-[#30363d]">
                    Size: <strong className="text-white">18.4 MB</strong>
                  </span>
                  <span className="bg-[#21262d] text-[#c9d1d9] px-3 py-1 rounded-full border border-[#30363d]">
                    Target: <strong className="text-white">Android 14 (API 34)</strong>
                  </span>
                  <span className="bg-[#21262d] text-[#c9d1d9] px-3 py-1 rounded-full border border-[#30363d]">
                    Min SDK: <strong className="text-white">Android 7.0+ (API 24)</strong>
                  </span>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => handleDownloadApk()}
                    className="w-full sm:w-auto bg-[#238636] hover:bg-[#2ea043] text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all transform active:scale-95 shadow-md shadow-emerald-900/50 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download WellsFargo-Mobile-v1.4.2-b37-release.apk</span>
                  </button>
                </div>
              </div>

              {/* 3-Step Sideloading Installation Instructions */}
              <div className="space-y-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#3fb950]" />
                  <span>How to Install on Android Devices</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-3">
                    <div className="w-7 h-7 rounded-full bg-[#58a6ff]/20 text-[#58a6ff] flex items-center justify-center font-bold text-xs">
                      1
                    </div>
                    <h5 className="font-semibold text-white text-sm">Download APK</h5>
                    <p className="text-xs text-[#8b949e] leading-relaxed">
                      Tap the "Download APK" button above on your Android phone or tablet. The `.apk` file will save to your Downloads folder.
                    </p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-3">
                    <div className="w-7 h-7 rounded-full bg-[#d29922]/20 text-[#d29922] flex items-center justify-center font-bold text-xs">
                      2
                    </div>
                    <h5 className="font-semibold text-white text-sm">Allow Unknown Apps</h5>
                    <p className="text-xs text-[#8b949e] leading-relaxed">
                      When prompted by Android Security, tap <strong>Settings</strong> and switch ON <em>"Allow from this source"</em> for Chrome or your File Manager.
                    </p>
                  </div>

                  <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-5 space-y-3">
                    <div className="w-7 h-7 rounded-full bg-[#3fb950]/20 text-[#3fb950] flex items-center justify-center font-bold text-xs">
                      3
                    </div>
                    <h5 className="font-semibold text-white text-sm">Tap Install & Launch</h5>
                    <p className="text-xs text-[#8b949e] leading-relaxed">
                      Tap <strong>Install</strong> on the package installer prompt, then tap <strong>Open</strong> to start banking with biometric authentication.
                    </p>
                  </div>
                </div>
              </div>

              {/* Security & Verification Details */}
              <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 text-xs space-y-2">
                <div className="text-white font-semibold flex items-center gap-2">
                  <span>Cryptographic Checksums & Signing</span>
                </div>
                <div className="font-mono text-[11px] text-[#8b949e] break-all bg-[#0d1117] p-2.5 rounded-md border border-[#30363d]">
                  SHA-256 Checksum: e8c4b9173d10294ea511c9bc43029f63541b9d0ae7ca84992305a2ef0139b2c8
                </div>
                <p className="text-[11px] text-[#8b949e]">
                  Compiled with Google Android Build Tools v34.0.0. Signed with APK Signature Scheme v2 & v3 for Android 7.0 through Android 14.
                </p>
              </div>
            </div>
          )}

          {/* Tab 3: Official Wells Fargo Brand & Logo Assets (Web & Android Phone) */}
          {activeTab === 'logos' && <WellsFargoLogosTab />}

          {/* Tab 4: Android Error Resolver & Diagnostics */}
          {activeTab === 'diagnostics' && <AndroidDiagnosticsTab />}

          {/* Tab 5: Workflow File Preview (.github/workflows/build-apk.yml) */}
          {activeTab === 'workflow-file' && (
            <div className="p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#8b949e]">File:</span>
                  <span className="font-mono text-white">.github/workflows/build-apk.yml</span>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(workflowYaml);
                    setCopiedYaml(true);
                    setTimeout(() => setCopiedYaml(false), 2000);
                  }}
                  className="bg-[#21262d] hover:bg-[#30363d] text-white px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 border border-[#30363d] transition-colors cursor-pointer"
                >
                  {copiedYaml ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#3fb950]" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#8b949e]" />
                      <span>Copy YAML</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-[#090d13] border border-[#30363d] rounded-lg p-4 font-mono text-xs text-[#c9d1d9] overflow-x-auto leading-relaxed">
                <pre>{workflowYaml}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Dispatch Workflow Modal */}
        {isDispatchModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-md w-full p-5 space-y-4 shadow-2xl animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[#30363d] pb-3">
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <Play className="w-4 h-4 text-[#3fb950]" />
                  <span>Run workflow: Build Android APK</span>
                </h4>
                <button
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="text-[#8b949e] hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[#8b949e] block mb-1">Use workflow from</label>
                  <select
                    value={dispatchBranch}
                    onChange={(e) => setDispatchBranch(e.target.value)}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-white text-xs focus:outline-hidden"
                  >
                    <option value="main">Branch: main</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#8b949e] block mb-1">Build Type</label>
                  <select
                    value={dispatchBuildType}
                    onChange={(e) => setDispatchBuildType(e.target.value as 'release' | 'debug')}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-white text-xs focus:outline-hidden"
                  >
                    <option value="release">release (Signed production APK)</option>
                    <option value="debug">debug (Developer debug APK)</option>
                  </select>
                </div>

                <div className="bg-[#0d1117] p-3 rounded-lg border border-[#30363d] text-[11px] text-[#8b949e] leading-relaxed">
                  Triggering this workflow will dispatch a new build on GitHub Actions runner `ubuntu-latest`. It will run Gradle packaging, assemble the APK, and upload the build artifact.
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#30363d]">
                <button
                  onClick={() => setIsDispatchModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#8b949e] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRunNewWorkflow}
                  className="bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Run workflow</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
