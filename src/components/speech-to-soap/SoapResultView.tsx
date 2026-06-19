import type {
  SOAPResult,
  SuggestedDiagnosis,
  SuggestedProcedure,
} from "@/types";
import { JSX } from "preact/jsx-runtime";
import { SuggestionPanel } from "./SuggestionPanel";
import type { SaveSOAPType } from "@/hooks/useSpeechToSOAP";

interface Props {
  result: SOAPResult;
  onReset: () => void;
  onConfirm: (
    type: SaveSOAPType,
    selected: SuggestedDiagnosis[] | SuggestedProcedure[],
  ) => void;
  onSave: (
    type: SaveSOAPType,
    selected: SuggestedDiagnosis[] | SuggestedProcedure[],
  ) => void;
}

function normalizeContent(content: any): JSX.Element | string {
  if (content == null) return "";
  if (typeof content === "string") return content;

  if (typeof content === "object") {
    return (
      <table class="soap-table">
        <tbody>
          {Object.entries(content).map(([k, v]) => (
            <tr key={k}>
              <td class="soap-key">{k.replace(/_/g, " ")}</td>
              <td class="soap-value">{String(v)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return String(content);
}

function CopyButton({ text }: { text: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  };

  return (
    <button class="btn-copy" onClick={handleCopy}>
      📋 Salin
    </button>
  );
}

export function SoapResultView({ result, onReset, onConfirm, onSave }: Props) {
  const { soap, anamesa, transcriptUsed, sugest_diagnosis, sugest_procedures } =
    result;
  const sections = [
    {
      key: "S",
      label: "Subjective",
      content: normalizeContent(soap.Subjective),
      color: "blue",
    },
    {
      key: "O",
      label: "Objective",
      content: normalizeContent(soap.Objective),
      color: "green",
    },
    {
      key: "A",
      label: "Assessment",
      content: normalizeContent(soap.Assessment),
      color: "orange",
    },
    {
      key: "P",
      label: "Plan",
      content: normalizeContent(soap.Plan),
      color: "purple",
    },
  ] as const;

  return (
    <div class="soap-result">
      <div class="soap-result-header">
        <div class="result-badge result-badge--green">
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Generate Selesai
        </div>
        <span class="soap-result-ts">
          {result.generatedAt.toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      <div class="soap-transcript-preview">
        <div class="soap-transcript-header">
          <p class="soap-transcript-label">Transkripsi</p>
          <CopyButton text={transcriptUsed} />
        </div>
        <p class="soap-transcript-text">{transcriptUsed}</p>
      </div>

      <div class="soap-transcript-preview">
        <div class="soap-transcript-header">
          <p class="soap-transcript-label">Anamesa</p>
          <CopyButton text={anamesa} />
        </div>
        <p class="soap-transcript-text">{anamesa}</p>
      </div>

      <div class="soap-sections">
        {sections.map((s) => (
          <div key={s.key} class={`soap-section soap-section--${s.color}`}>
            <div class="soap-section-head">
              <span class="soap-section-icon">{s.key}</span>
              <span class="soap-section-label">{s.label}</span>
            </div>
            <div class="soap-section-content">{s.content}</div>
          </div>
        ))}
      </div>
      
      <SuggestionPanel
        diagnoses={sugest_diagnosis ?? []}
        procedures={sugest_procedures ?? []}
        onSave={onSave}
      />

      <div class="soap-actions">
        <button class="btn btn-secondary btn-sm" onClick={onReset}>
          Rekam Baru
        </button>
        <button
          class="btn btn-primary btn-sm"
          style="display: none"
          onClick={() => {
            onConfirm("DIAGNOSE", result.sugest_diagnosis ?? []);
            onConfirm("PROCEDURE", result.sugest_procedures ?? []);
          }}
        >
          Simpan ke HIS
        </button>
      </div>
    </div>
  );
}
