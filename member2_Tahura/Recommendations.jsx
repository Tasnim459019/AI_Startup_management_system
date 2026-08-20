import { useState } from "react";
import Layout from "../components/Layout";
import { Sparkles, RefreshCw } from "lucide-react";
import { NAVY, ORANGE } from "../theme";

export default function Recommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  const fetchRecommendations = () => {
    setLoading(true);
    setError(null);

    fetch("http://localhost:5000/api/ai/recommendations")
      .then((res) => res.json())
      .then((data) => {
        setRecommendations(data);
        setLoading(false);
        setHasGenerated(true);
      })
      .catch(() => {
        setError("Could not generate recommendations. Is the backend server running?");
        setLoading(false);
      });
  };

  return (
    <Layout title="AI Recommendation Center">
      <div className="mb-6">
        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-sm font-medium disabled:opacity-60"
          style={{ background: ORANGE }}
        >
          {loading ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Analyzing your data...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              {hasGenerated ? "Regenerate Recommendations" : "Generate Recommendations"}
            </>
          )}
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {!hasGenerated && !loading && !error && (
        <p className="text-slate-500">
          Click the button above to have AI analyze your tasks, budget, and risks.
        </p>
      )}

      <div className="space-y-4">
        {recommendations.map((rec, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 flex items-start gap-4">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-white"
              style={{ background: ORANGE }}
            >
              <Sparkles size={16} />
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ color: NAVY }}>
                {rec.title}
              </p>
              <p className="text-sm text-slate-700">{rec.suggestion}</p>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}