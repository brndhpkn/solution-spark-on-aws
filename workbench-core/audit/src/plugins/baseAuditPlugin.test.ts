/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 */

import AuditEntry from '../auditEntry';
import Metadata from '../metadata';
import BaseAuditPlugin from './baseAuditPlugin';
import Writer from './writer';

describe('BaseAuditPlugin', () => {
  let auditEntry: AuditEntry;
  let writer: Writer;
  let metadata: Metadata;
  let baseAuditPlugin: BaseAuditPlugin;
  beforeEach(async () => {
    auditEntry = {};
    metadata = {
      statusCode: 200,
      action: 'GET /user',
      source: { ip: 'sampleIP' },
      actor: { uid: 'sampleID' }
    };
    writer = {
      write: jest.fn(),
      prepare: jest.fn()
    };
    baseAuditPlugin = new BaseAuditPlugin(writer);
  });
  describe('.prepare', () => {
    test('Prepare audit entry', async () => {
      await baseAuditPlugin.prepare(metadata, auditEntry);
      expect(auditEntry.logEventType).toBe('audit');
      expect(auditEntry.action).toBe(metadata.action);
      expect(auditEntry.source).toBe(metadata.source);
      expect(auditEntry.statusCode).toBe(metadata.statusCode);
      expect(auditEntry.actor).toBe(metadata.actor);
    });
  });

  describe('.write', () => {
    test('Write audit entry to output', async () => {
      await baseAuditPlugin.write(metadata, auditEntry);
      expect(writer.write).toHaveBeenCalledWith(metadata, auditEntry);
    });
  });
});
