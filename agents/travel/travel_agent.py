from datetime import datetime, timezone, timedelta

class TravelAgent:
    def evaluate(self, context):
        # Convert duty_start_time to a datetime object if needed
        if isinstance(context.duty_start_time, str):
            try:
                duty_start = datetime.fromisoformat(context.duty_start_time.replace("Z", "+00:00"))
            except ValueError:
                return {
                    "action": "Reject travel",
                    "reason": "Invalid datetime format for duty_start_time",
                    "minutes_to_report": None
                }
        else:
            duty_start = context.duty_start_time

        now_utc = datetime.now(timezone.utc)
        report_minutes = int((duty_start - now_utc).total_seconds() / 60)

        context.log("TravelAgent", f"Time to report: {report_minutes} minutes")

        if context.travel_type == "gateway":
            context.log("TravelAgent", "Gateway travel authorized based on travel_type")
        else:
            return {
                "action": "Reject travel",
                "reason": "Only gateway travel supported in current prototype",
                "minutes_to_report": report_minutes
            }

        # CBA/LOA check: 12 hours (720 min) cutoff
        if report_minutes > 720:
            return {
                "action": "Reject travel",
                "reason": "Report time too far from duty period (more than 720 mins)",
                "minutes_to_report": report_minutes
            }

        # Log preferences
        context.log("TravelAgent", f"Checking preferences: airline {context.preferred_airlines}, seat {context.seat_pref}")

        return {
            "action": "Approve travel",
            "reason": "Travel falls within CBA/LOA bounds and preferences captured.",
            "minutes_to_report": report_minutes,
            "preferred_airlines": context.preferred_airlines,
            "seat_preference": context.seat_pref
        }
