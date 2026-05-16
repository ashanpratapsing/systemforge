package com.systemforge.workflow.service.kafka;

import com.systemforge.workflow.config.KafkaTopicConfig;
import com.systemforge.workflow.entity.OutboxEventEntity;
import com.systemforge.workflow.repository.OutboxRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@EnableScheduling
@RequiredArgsConstructor
@Slf4j
public class OutboxPublisherService {

    private final OutboxRepository outboxRepository;
    private final KafkaTemplate<String, String> kafkaTemplate;

    @Scheduled(fixedDelay = 2000)
    @Transactional
    public void publishPendingEvents() {
        List<OutboxEventEntity> pendingEvents = outboxRepository.findByStatusOrderByCreatedAtAsc("PENDING");

        if (!pendingEvents.isEmpty()) {
            log.info("Found {} pending outbox events. Publishing to Kafka...", pendingEvents.size());
        }

        for (OutboxEventEntity event : pendingEvents) {
            try {
                // Key = aggregateId (ProjectId) ensures strict ordering per project partition
                kafkaTemplate.send(KafkaTopicConfig.WORKFLOW_EVENTS_TOPIC, event.getAggregateId(), event.getPayload());
                
                event.setStatus("PROCESSED");
                outboxRepository.save(event);
                
                log.debug("Successfully published event {} for project {}", event.getId(), event.getAggregateId());
            } catch (Exception e) {
                log.error("Failed to publish event {}", event.getId(), e);
                event.setStatus("ERROR");
                outboxRepository.save(event);
            }
        }
    }
}
