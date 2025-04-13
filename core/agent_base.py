from abc import ABC, abstractmethod

class AgentBase(ABC):
    @abstractmethod
    def evaluate(self, context):
        pass
