from core.agent_base import AgentBase

class CrewAgent(AgentBase):
    def evaluate(self, context):
        context.log("CrewAgent", "Evaluating crew legality.")
        return {
            "action": "Suggest delay",
            "reason": "Best candidate legal with 180 min delay"
        }
