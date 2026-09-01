import sys
import os
import json
import re
import ast
import pandas as pd
import joblib

def parse_arguments(args):
    if not args:
        raise ValueError("No input arguments provided.")

    combined = " ".join(args).strip()

    # Check if input is JSON or dictionary-like payload
    if combined.startswith("{") or combined.startswith("'{") or combined.startswith('"{') or any("crop" in arg.lower() for arg in args):
        clean_str = combined
        if (clean_str.startswith("'") and clean_str.endswith("'")) or (clean_str.startswith('"') and clean_str.endswith('"')):
            clean_str = clean_str[1:-1].strip()

        data = None
        # Attempt 1: Standard JSON parsing
        try:
            data = json.loads(clean_str)
        except Exception:
            pass

        # Attempt 2: Python dictionary literal
        if data is None:
            try:
                data = ast.literal_eval(clean_str)
            except Exception:
                pass

        # Attempt 3: Key-value regex parsing for shell environments where quotes are stripped
        if data is None or not isinstance(data, dict):
            inner = clean_str.strip("{} \t\r\n")
            pattern = re.compile(r'["\']?([a-zA-Z0-9_]+)["\']?\s*:\s*["\']?([^,\'"}]+)["\']?')
            matches = pattern.findall(inner)
            if matches:
                data = {k.strip(): v.strip() for k, v in matches}

        if not isinstance(data, dict) or not data:
            raise ValueError(f"Failed to parse JSON input: {combined}")

        norm = {str(k).lower().replace("_", ""): v for k, v in data.items()}

        def get_val(keys, default=None):
            for k in keys:
                k_clean = k.lower().replace("_", "")
                if k_clean in norm:
                    return norm[k_clean]
            return default

        crop_val = get_val(['crop', 'cropname'], None)
        if crop_val is None:
            raise ValueError("Missing required field: 'crop'")

        area_val = get_val(['area', 'farmarea', 'acres'], None)
        if area_val is None:
            raise ValueError("Missing required field: 'area'")

        crop = str(crop_val).strip()
        area = float(area_val)
        soil_type = str(get_val(['soiltype', 'soil', 'soil_type'], 'loamy')).strip()
        ph = float(get_val(['ph', 'soilph'], 6.5))
        n = float(get_val(['n', 'nitrogen'], 50))
        p = float(get_val(['p', 'phosphorus'], 20))
        k = float(get_val(['k', 'potassium'], 20))
        rainfall = float(get_val(['rainfall', 'rain'], 150))
        temp = float(get_val(['temperature', 'temp'], 25))
        humidity = float(get_val(['humidity', 'hum'], 75))
        season = str(get_val(['season'], 'kharif')).strip()

        return crop, area, soil_type, ph, n, p, k, rainfall, temp, humidity, season

    # Positional arguments: expected 11 parameters
    if len(args) >= 11:
        crop = str(args[0]).strip()
        area = float(args[1])
        soil_type = str(args[2]).strip()
        ph = float(args[3])
        n = float(args[4])
        p = float(args[5])
        k = float(args[6])
        rainfall = float(args[7])
        temp = float(args[8])
        humidity = float(args[9])
        season = " ".join(args[10:]).strip()
        return crop, area, soil_type, ph, n, p, k, rainfall, temp, humidity, season

    raise ValueError(f"Invalid arguments. Expected 11 parameters or a JSON object, received {len(args)} arguments.")

def predict():
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(current_dir, "yield_model.pkl")

        if not os.path.exists(model_path):
            print(json.dumps({
                "success": False,
                "message": "Yield prediction model not found."
            }))
            return

        crop, area, soil_type, ph, n, p, k, rainfall, temp, humidity, season = parse_arguments(sys.argv[1:])

        model = joblib.load(model_path)

        feature_names = [
            'crop',
            'area',
            'soil_type',
            'ph',
            'N',
            'P',
            'K',
            'rainfall',
            'temperature',
            'humidity',
            'season'
        ]

        input_df = pd.DataFrame([{
            'crop': crop.lower(),
            'area': area,
            'soil_type': soil_type.lower(),
            'ph': ph,
            'N': n,
            'P': p,
            'K': k,
            'rainfall': rainfall,
            'temperature': temp,
            'humidity': humidity,
            'season': season.lower()
        }], columns=feature_names)

        raw_prediction = float(model.predict(input_df)[0])
        yield_per_acre = round(raw_prediction, 2)
        total_yield = round(yield_per_acre * area, 2)

        unit = "Nuts" if "coconut" in crop.lower() else "Tons"

        output = {
            "success": True,
            "yieldPerAcre": yield_per_acre,
            "totalYield": total_yield,
            "unit": unit,
            "provider": "RandomForestRegressor"
        }
        print(json.dumps(output))

    except Exception as e:
        print(json.dumps({
            "success": False,
            "message": f"Yield prediction failed: {str(e)}"
        }))

if __name__ == "__main__":
    predict()

