from fastapi import FastAPI, Form
import json

app = FastAPI()


@app.post("/debug")
async def debug(
    vital_sign_list: str = Form(...),
    soapi_template: str = Form(...),
    output_language: str = Form(...),
    dialect: str = Form(...),
    reference_cases_show: str = Form(...),
    show_prompts: str = Form(...),
    is_bpjs: str = Form(...),
    reference_is_bpjs_only: str = Form(...)
):
    try:
        vital_signs = json.loads(soapi_template)
    except Exception as ex:
        return {
            "success": False,
            "error": str(ex),
            "raw": soapi_template
        }
        
    print("=" * 50)
    print("Output Language :", output_language)
    print("Dialect         :", dialect)
    print("Reference Case  :", reference_cases_show)
    print("Show Prompts    :", show_prompts)
    print("Is BPJS         :", is_bpjs)
    print("BPJS Only       :", reference_is_bpjs_only)
    print("Vital Signs:")
    print(json.dumps(vital_signs, indent=4, ensure_ascii=False))
    print("=" * 50)

    return {
        "success": True,
        "type": str(type(vital_signs)),
        "count": len(vital_signs) if isinstance(vital_signs, list) else None,
        "soapi_template": vital_signs
    }