function PredictionCard({ prediction }) {
    if (!prediction) return null;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">

            <h2 className="text-2xl font-bold text-green-700 mb-5">
                AI Prediction Result
            </h2>

            <div className="space-y-3">

                <p>
                    <strong>Disease:</strong> {prediction.disease}
                </p>

                <p>
                    <strong>Confidence:</strong> {prediction.confidence}%
                </p>

                <p>
                    <strong>Severity:</strong> {prediction.severity}
                </p>

                <p>
                    <strong>Treatment:</strong>
                    <br />
                    {prediction.treatment}
                </p>

                <p>
                    <strong>Prevention:</strong>
                    <br />
                    {prediction.prevention}
                </p>

            </div>

        </div>
    );
}

export default PredictionCard;